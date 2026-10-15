import { describe, expect, it } from "vitest";
import { PLAYER_ONE, PLAYER_TWO, TOTT, TZAAR, TZARRA } from "../../constants";
import {
  canCaptureAnyPiece,
  getHasAllThreePieceTypes,
  getWinner,
  isAnyPieceCapturable,
} from "../evaluationHelpers";
import { setupSymmetricalBoard } from "../gameBoardHelpers";
import { boardWith, piece } from "./testUtils";

/** Both players have all three types and nobody can reach anybody. */
function farApartBoard() {
  return boardWith({
    "0,4": piece(PLAYER_ONE, TOTT),
    "0,5": piece(PLAYER_ONE, TZARRA),
    "0,6": piece(PLAYER_ONE, TZAAR),
    "8,0": piece(PLAYER_TWO, TOTT),
    "8,1": piece(PLAYER_TWO, TZARRA),
    "8,2": piece(PLAYER_TWO, TZAAR),
  });
}

/** Both players have all three types and player one's TOTT can take player two's. */
function contactBoard() {
  return boardWith({
    "0,4": piece(PLAYER_ONE, TOTT),
    "0,5": piece(PLAYER_ONE, TZARRA),
    "0,6": piece(PLAYER_ONE, TZAAR),
    "2,4": piece(PLAYER_TWO, TOTT),
    "8,1": piece(PLAYER_TWO, TZARRA),
    "8,2": piece(PLAYER_TWO, TZAAR),
  });
}

describe("getHasAllThreePieceTypes", () => {
  it("returns undefined when both players still own every type", () => {
    expect(getHasAllThreePieceTypes(setupSymmetricalBoard())).toBeUndefined();
    expect(getHasAllThreePieceTypes(farApartBoard())).toBeUndefined();
  });

  it("returns 1 when player one is missing a type", () => {
    const board = farApartBoard();
    board["0,6"] = false; // player one loses their TZAAR
    expect(getHasAllThreePieceTypes(board)).toBe(1);
  });

  it("returns 2 when player two is missing a type", () => {
    const board = farApartBoard();
    board["8,0"] = false; // player two loses their TOTT
    expect(getHasAllThreePieceTypes(board)).toBe(2);
  });
});

describe("capture availability", () => {
  it("knows whether a player has any capture available", () => {
    expect(canCaptureAnyPiece(contactBoard(), PLAYER_ONE)).toBe(true);
    expect(canCaptureAnyPiece(contactBoard(), PLAYER_TWO)).toBe(true);
    expect(canCaptureAnyPiece(farApartBoard(), PLAYER_ONE)).toBe(false);
    expect(canCaptureAnyPiece(farApartBoard(), PLAYER_TWO)).toBe(false);
  });

  it("knows whether any of a player's pieces can be captured", () => {
    expect(isAnyPieceCapturable(contactBoard(), PLAYER_ONE)).toBe(true);
    expect(isAnyPieceCapturable(farApartBoard(), PLAYER_ONE)).toBe(false);
  });
});

describe("getWinner", () => {
  it("awards the game to the opponent of whoever lost a piece type", () => {
    const playerOneMissingType = farApartBoard();
    playerOneMissingType["0,6"] = false;
    expect(getWinner(playerOneMissingType, true, PLAYER_ONE)).toBe(PLAYER_TWO);

    const playerTwoMissingType = farApartBoard();
    playerTwoMissingType["8,0"] = false;
    expect(getWinner(playerTwoMissingType, true, PLAYER_TWO)).toBe(PLAYER_ONE);
  });

  it("before a turn starts, a player with no capture available loses", () => {
    expect(getWinner(farApartBoard(), true, PLAYER_ONE)).toBe(PLAYER_TWO);
    expect(getWinner(farApartBoard(), true, PLAYER_TWO)).toBe(PLAYER_ONE);
    expect(getWinner(contactBoard(), true, PLAYER_ONE)).toBeUndefined();
  });

  it("after a move, a player none of whose pieces can be captured wins", () => {
    expect(getWinner(farApartBoard(), false, PLAYER_ONE)).toBe(PLAYER_ONE);
    expect(getWinner(farApartBoard(), false, PLAYER_TWO)).toBe(PLAYER_TWO);
    expect(getWinner(contactBoard(), false, PLAYER_ONE)).toBeUndefined();
  });

  it("the opening position is not a finished game", () => {
    expect(getWinner(setupSymmetricalBoard(), true, PLAYER_ONE)).toBeUndefined();
  });
});
