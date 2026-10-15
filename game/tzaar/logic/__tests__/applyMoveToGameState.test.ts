// gameLogic must load before BotFactory/EvaluationFactory: the three modules
// form an import cycle and gameLogic constructs bots at import time.
import "../gameLogic";
import { describe, expect, it } from "vitest";
import { PLAYER_ONE, PLAYER_TWO, TOTT, TZARRA } from "../../constants";
import { applyMoveToGameState } from "../BotFactory";
import { boardWith, piece } from "./testUtils";

describe("applyMoveToGameState", () => {
  it("applies a single capture without mutating the input board", () => {
    const board = boardWith({
      "0,4": piece(PLAYER_ONE, TOTT),
      "2,4": piece(PLAYER_TWO, TOTT),
    });

    const next = applyMoveToGameState(board, "0,4->2,4");

    expect(next["0,4"]).toBe(false);
    expect(next["2,4"]).toEqual(piece(PLAYER_ONE, TOTT));
    // original untouched
    expect(board["0,4"]).toEqual(piece(PLAYER_ONE, TOTT));
    expect(board["2,4"]).toEqual(piece(PLAYER_TWO, TOTT));
  });

  it("applies a capture followed by a stack, adding the stack sizes", () => {
    const board = boardWith({
      "0,4": piece(PLAYER_ONE, TOTT),
      "2,4": piece(PLAYER_TWO, TOTT),
      "0,5": piece(PLAYER_ONE, TOTT, 1),
      "0,6": piece(PLAYER_ONE, TZARRA, 2),
    });

    const next = applyMoveToGameState(board, "0,4->2,4=>0,5->0,6");

    expect(next["0,4"]).toBe(false);
    expect(next["2,4"]).toEqual(piece(PLAYER_ONE, TOTT));
    expect(next["0,5"]).toBe(false);
    expect(next["0,6"]).toEqual(piece(PLAYER_ONE, TOTT, 3));
  });

  it("applies a capture followed by a second capture", () => {
    const board = boardWith({
      "0,4": piece(PLAYER_ONE, TOTT),
      "2,4": piece(PLAYER_TWO, TOTT),
      "0,5": piece(PLAYER_ONE, TZARRA),
      "0,7": piece(PLAYER_TWO, TZARRA),
    });

    const next = applyMoveToGameState(board, "0,4->2,4=>0,5->0,7");

    expect(next["0,5"]).toBe(false);
    expect(next["0,7"]).toEqual(piece(PLAYER_ONE, TZARRA));
  });
});
