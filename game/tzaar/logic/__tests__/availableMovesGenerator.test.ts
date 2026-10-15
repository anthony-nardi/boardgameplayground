import { beforeEach, describe, expect, it } from "vitest";
import { PLAYER_ONE, PLAYER_TWO, TOTT, TZAAR, TZARRA } from "../../constants";
import {
  getAllPlayerPieceCoordinates,
  getAllPlayerPieceCoordinatesByType,
  getEarlyGameMoveSequences,
  getGameStatesToAnalyze,
  getPossibleMoveSequences,
} from "../availableMovesGenerator";
import { setupSymmetricalBoard } from "../gameBoardHelpers";
import GameState from "../GameState";
import { boardWith, piece } from "./testUtils";

describe("piece lookups", () => {
  it("finds every piece a player owns", () => {
    const board = setupSymmetricalBoard();
    expect(getAllPlayerPieceCoordinates(board, PLAYER_ONE)).toHaveLength(30);
    expect(getAllPlayerPieceCoordinates(board, PLAYER_TWO)).toHaveLength(30);
  });

  it("filters by type and minimum stack size", () => {
    const board = boardWith({
      "0,4": piece(PLAYER_ONE, TOTT, 1),
      "0,5": piece(PLAYER_ONE, TOTT, 2),
      "0,6": piece(PLAYER_ONE, TZAAR, 3),
      "8,0": piece(PLAYER_TWO, TOTT, 5),
    });

    expect(getAllPlayerPieceCoordinatesByType(board, PLAYER_ONE, TOTT)).toEqual(
      ["0,4", "0,5"]
    );
    expect(
      getAllPlayerPieceCoordinatesByType(board, PLAYER_ONE, TOTT, 2)
    ).toEqual(["0,5"]);
    expect(
      getAllPlayerPieceCoordinatesByType(board, PLAYER_ONE, TZARRA)
    ).toEqual([]);
  });
});

describe("getPossibleMoveSequences", () => {
  it("generates capture-then-pass and leaves the board untouched", () => {
    const board = boardWith({
      "0,4": piece(PLAYER_ONE, TOTT),
      "2,4": piece(PLAYER_TWO, TOTT),
      "0,8": piece(PLAYER_ONE, TZARRA), // no moves of its own
    });
    const before = JSON.stringify(board);

    const moves = getPossibleMoveSequences(board, PLAYER_ONE);

    expect(moves).toEqual(["0,4->2,4"]);
    expect(JSON.stringify(board)).toBe(before);
  });

  it("generates capture-then-stack and capture-then-capture follow ups", () => {
    const board = boardWith({
      "0,4": piece(PLAYER_ONE, TOTT),
      "2,4": piece(PLAYER_TWO, TOTT),
      "0,5": piece(PLAYER_ONE, TZARRA),
      "0,6": piece(PLAYER_ONE, TZAAR),
      "0,8": piece(PLAYER_TWO, TOTT),
    });

    const moves = getPossibleMoveSequences(board, PLAYER_ONE);

    expect(moves).toContain("0,4->2,4=>0,5->0,6"); // stack
    expect(moves).toContain("0,4->2,4=>0,6->0,8"); // second capture
    expect(moves).toContain("0,4->2,4"); // capture then pass

    // Every sequence opens with one of the three available captures
    // (the TZAAR on 0,6 can reach 2,4 to the north east as well as 0,8).
    const openingCaptures = new Set(moves.map((m) => m.split("=>")[0]));
    expect(openingCaptures).toEqual(
      new Set(["0,4->2,4", "0,6->0,8", "0,6->2,4"])
    );
  });

  it("returns nothing for a player with no captures", () => {
    const board = boardWith({
      "0,4": piece(PLAYER_ONE, TOTT),
      "8,0": piece(PLAYER_TWO, TOTT),
    });

    expect(getPossibleMoveSequences(board, PLAYER_ONE)).toEqual([]);
  });
});

describe("getEarlyGameMoveSequences", () => {
  it("captures the requested opponent type, then stacks our pieces of that type", () => {
    const board = boardWith({
      "0,4": piece(PLAYER_ONE, TOTT),
      "2,4": piece(PLAYER_TWO, TZAAR),
      "0,5": piece(PLAYER_ONE, TOTT),
      "0,7": piece(PLAYER_TWO, TOTT),
      "8,1": piece(PLAYER_ONE, TZAAR),
      "8,3": piece(PLAYER_ONE, TZAAR),
    });
    const before = JSON.stringify(board);

    const tzaarMoves = getEarlyGameMoveSequences(board, PLAYER_ONE, TZAAR);
    const tottMoves = getEarlyGameMoveSequences(board, PLAYER_ONE, TOTT);

    // Capture the TZAAR at 2,4 and then stack one of our TZAARs on the other.
    expect(tzaarMoves).toEqual(
      expect.arrayContaining(["0,4->2,4=>8,1->8,3", "0,4->2,4=>8,3->8,1"])
    );
    expect(tzaarMoves.every((m) => m.startsWith("0,4->2,4"))).toBe(true);

    // Capture the TOTT at 0,7, then the moved TOTT can stack back onto 0,4.
    expect(tottMoves).toContain("0,5->0,7=>0,7->0,4");
    expect(tottMoves.every((m) => m.startsWith("0,5->0,7"))).toBe(true);

    expect(JSON.stringify(board)).toBe(before);
  });

  it("produces nothing when we own no pieces of that type to stack", () => {
    const board = boardWith({
      "0,4": piece(PLAYER_ONE, TOTT),
      "2,4": piece(PLAYER_TWO, TZAAR),
    });

    expect(getEarlyGameMoveSequences(board, PLAYER_ONE, TZAAR)).toEqual([]);
  });
});

describe("getGameStatesToAnalyze", () => {
  beforeEach(() => {
    GameState.setInitialGameState(PLAYER_ONE, "CAPTURE", 0);
  });

  it("on the very first turn only considers captures of opponent TZAARs", () => {
    GameState.setNumberOfTurnsIntoGame(0);
    const tzaarTarget = boardWith({
      "0,4": piece(PLAYER_ONE, TOTT),
      "2,4": piece(PLAYER_TWO, TZAAR),
    });
    const tottTarget = boardWith({
      "0,4": piece(PLAYER_ONE, TOTT),
      "2,4": piece(PLAYER_TWO, TOTT),
    });

    expect(getGameStatesToAnalyze(tzaarTarget, PLAYER_ONE)).toEqual([
      "0,4->2,4",
    ]);
    expect(getGameStatesToAnalyze(tottTarget, PLAYER_ONE)).toEqual([]);
  });

  it("later in the game considers every legal sequence", () => {
    GameState.setNumberOfTurnsIntoGame(11);
    const board = boardWith({
      "0,4": piece(PLAYER_ONE, TOTT),
      "2,4": piece(PLAYER_TWO, TOTT),
      "0,8": piece(PLAYER_ONE, TZARRA),
    });

    expect(getGameStatesToAnalyze(board, PLAYER_ONE)).toEqual(
      getPossibleMoveSequences(board, PLAYER_ONE)
    );
  });
});
