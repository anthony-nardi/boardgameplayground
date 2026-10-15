import { describe, expect, it } from "vitest";
import {
  NUMBER_OF_TOTTS,
  NUMBER_OF_TZAARS,
  NUMBER_OF_TZARRAS,
  PLAYABLE_VERTICES,
  PLAYER_ONE,
  PLAYER_TWO,
  TOTT,
  TZAAR,
  TZARRA,
} from "../../constants";
import {
  canCapture,
  canStack,
  getAnyCapture,
  getAnyInvertedValidCaptures,
  getInvertedValidCaptures,
  getValidCaptures,
  getValidStacks,
  getValidStacksAndCaptures,
  goEast,
  goNorthEast,
  goNorthWest,
  goSouthEast,
  goSouthWest,
  goWest,
  isPlayableSpace,
  isValidEmptyCoordinate,
  nextPiece,
  setupSymmetricalBoard,
} from "../gameBoardHelpers";
import { ValidCoordinate } from "../../types/types";
import { boardWith, countPieces, piece } from "./testUtils";

// The centre of the board is not a playable vertex.
const HOLE = "4,4" as unknown as ValidCoordinate;

describe("direction helpers", () => {
  it("move one step along each axis of the hex grid", () => {
    expect(goWest("5,3")).toBe("4,3");
    expect(goEast("5,3")).toBe("6,3");
    expect(goNorthWest("5,3")).toBe("5,2");
    expect(goNorthEast("5,3")).toBe("6,2");
    expect(goSouthWest("5,3")).toBe("4,4");
    expect(goSouthEast("5,3")).toBe("5,4");
  });

  it("memoized direction table matches the plain helpers", () => {
    expect(nextPiece.w("2,2")).toBe(goWest("2,2"));
    expect(nextPiece.e("2,2")).toBe(goEast("2,2"));
    expect(nextPiece.nw("2,2")).toBe(goNorthWest("2,2"));
    expect(nextPiece.ne("2,2")).toBe(goNorthEast("2,2"));
    expect(nextPiece.sw("2,2")).toBe(goSouthWest("2,2"));
    expect(nextPiece.se("2,2")).toBe(goSouthEast("2,2"));
  });
});

describe("board geometry", () => {
  it("has 60 playable vertices with a hole in the centre", () => {
    expect(PLAYABLE_VERTICES).toHaveLength(60);
    expect(isPlayableSpace(HOLE)).toBeFalsy();
    expect(isPlayableSpace("4,3")).toBeTruthy();
    expect(isPlayableSpace("0,4")).toBeTruthy();
    expect(isPlayableSpace("0,0" as never)).toBeFalsy();
  });

  it("isValidEmptyCoordinate requires a playable, empty vertex", () => {
    const board = boardWith({ "0,4": piece(PLAYER_ONE, TOTT) });
    expect(isValidEmptyCoordinate("0,4", board)).toBe(false);
    expect(isValidEmptyCoordinate("1,4", board)).toBe(true);
    expect(isValidEmptyCoordinate(HOLE, board)).toBe(false);
  });
});

describe("setupSymmetricalBoard", () => {
  it("fills every vertex with 30 pieces per player in the right proportions", () => {
    const board = setupSymmetricalBoard();

    expect(countPieces(board, () => true)).toBe(60);
    for (const player of [PLAYER_ONE, PLAYER_TWO] as const) {
      expect(countPieces(board, (p) => p.ownedBy === player)).toBe(30);
      expect(
        countPieces(board, (p) => p.ownedBy === player && p.type === TOTT)
      ).toBe(NUMBER_OF_TOTTS);
      expect(
        countPieces(board, (p) => p.ownedBy === player && p.type === TZARRA)
      ).toBe(NUMBER_OF_TZARRAS);
      expect(
        countPieces(board, (p) => p.ownedBy === player && p.type === TZAAR)
      ).toBe(NUMBER_OF_TZAARS);
    }
    expect(countPieces(board, (p) => p.stackSize !== 1)).toBe(0);
  });
});

describe("canCapture / canStack", () => {
  it("captures need an opponent piece with a stack no taller than ours", () => {
    const board = boardWith({
      "0,4": piece(PLAYER_ONE, TOTT, 2),
      "1,4": piece(PLAYER_TWO, TZAAR, 2),
      "2,4": piece(PLAYER_TWO, TOTT, 3),
      "3,4": piece(PLAYER_ONE, TOTT, 1),
    });

    expect(canCapture("0,4", "1,4", board)).toBe(true);
    expect(canCapture("0,4", "2,4", board)).toBe(false);
    expect(canCapture("0,4", "3,4", board)).toBe(false);
    expect(canCapture("0,4", "5,4", board)).toBe(false);
  });

  it("stacks need a friendly piece of any type", () => {
    const board = boardWith({
      "0,4": piece(PLAYER_ONE, TOTT),
      "1,4": piece(PLAYER_ONE, TZAAR, 4),
      "2,4": piece(PLAYER_TWO, TOTT),
    });

    expect(canStack("0,4", "1,4", board)).toBe(true);
    expect(canStack("0,4", "2,4", board)).toBe(false);
    expect(canStack("0,4", "5,4", board)).toBe(false);
  });
});

describe("line of sight moves", () => {
  it("finds a capture across empty vertices", () => {
    const board = boardWith({
      "0,4": piece(PLAYER_ONE, TOTT),
      "2,4": piece(PLAYER_TWO, TOTT),
    });

    expect(getValidCaptures("0,4", board)).toEqual(["2,4"]);
    expect(getValidStacks("0,4", board)).toEqual([]);
    expect(getValidStacksAndCaptures("0,4", board)).toEqual(["2,4"]);
    expect(getAnyCapture("0,4", board)).toBe("2,4");
  });

  it("finds a stack across empty vertices", () => {
    const board = boardWith({
      "0,4": piece(PLAYER_ONE, TOTT),
      "2,4": piece(PLAYER_ONE, TZARRA),
    });

    expect(getValidStacks("0,4", board)).toEqual(["2,4"]);
    expect(getValidCaptures("0,4", board)).toEqual([]);
    expect(getValidStacksAndCaptures("0,4", board)).toEqual(["2,4"]);
  });

  it("is blocked by the first piece it meets", () => {
    const board = boardWith({
      "0,4": piece(PLAYER_ONE, TOTT),
      "1,4": piece(PLAYER_ONE, TOTT),
      "2,4": piece(PLAYER_TWO, TOTT),
    });

    expect(getValidCaptures("0,4", board)).toEqual([]);
    expect(getValidStacks("0,4", board)).toEqual(["1,4"]);
  });

  it("cannot see through the hole in the centre of the board", () => {
    const board = boardWith({
      "3,4": piece(PLAYER_ONE, TOTT),
      "5,4": piece(PLAYER_TWO, TOTT),
    });

    expect(getValidCaptures("3,4", board)).toEqual([]);
    expect(getAnyCapture("3,4", board)).toBe(false);
  });

  it("respects stack height when capturing", () => {
    const smallerStack = boardWith({
      "0,4": piece(PLAYER_ONE, TOTT, 1),
      "2,4": piece(PLAYER_TWO, TOTT, 2),
    });
    const equalStack = boardWith({
      "0,4": piece(PLAYER_ONE, TOTT, 2),
      "2,4": piece(PLAYER_TWO, TOTT, 2),
    });

    expect(getValidCaptures("0,4", smallerStack)).toEqual([]);
    expect(getValidCaptures("0,4", equalStack)).toEqual(["2,4"]);
  });

  it("lists captures in every direction", () => {
    const board = boardWith({
      "4,2": piece(PLAYER_ONE, TZAAR, 3),
      "2,2": piece(PLAYER_TWO, TOTT), // west
      "7,2": piece(PLAYER_TWO, TOTT), // east
      "4,0": piece(PLAYER_TWO, TOTT), // north west
      "6,0": piece(PLAYER_TWO, TOTT), // north east
      "2,4": piece(PLAYER_TWO, TOTT), // south west
      "4,3": piece(PLAYER_TWO, TOTT), // south east (4,4 is the hole, so adjacent)
    });

    expect(getValidCaptures("4,2", board)).toEqual([
      "2,2",
      "7,2",
      "4,0",
      "6,0",
      "2,4",
      "4,3",
    ]);
  });
});

describe("inverted captures (who can capture this piece?)", () => {
  it("finds attackers that can reach the target", () => {
    const board = boardWith({
      "0,4": piece(PLAYER_ONE, TOTT, 1),
      "2,4": piece(PLAYER_TWO, TOTT, 1),
      "2,2": piece(PLAYER_ONE, TZAAR, 1), // two steps north-west of 2,4
    });

    expect(getInvertedValidCaptures("2,4", board)).toEqual(["0,4", "2,2"]);
    expect(getAnyInvertedValidCaptures("2,4", board)).toBe("0,4");
  });

  it("ignores attackers whose stacks are too small", () => {
    const board = boardWith({
      "0,4": piece(PLAYER_ONE, TOTT, 1),
      "2,4": piece(PLAYER_TWO, TOTT, 3),
    });

    expect(getInvertedValidCaptures("2,4", board)).toEqual([]);
    expect(getAnyInvertedValidCaptures("2,4", board)).toBe(false);
  });
});
