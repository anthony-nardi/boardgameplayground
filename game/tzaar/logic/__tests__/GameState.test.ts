import { beforeEach, describe, expect, it } from "vitest";
import {
  CAPTURE,
  PLAYABLE_VERTICES,
  PLAYER_ONE,
  PLAYER_TWO,
  STACK_OR_CAPTURE_OR_PASS,
} from "../../constants";
import GameState from "../GameState";
import { setupSymmetricalBoard } from "../gameBoardHelpers";

describe("GameState turn phases", () => {
  beforeEach(() => {
    GameState.setInitialGameState(PLAYER_ONE, CAPTURE, 0);
  });

  it("the very first turn is a single capture, then play passes to player two", () => {
    expect(GameState.getIsVeryFirstTurn()).toBe(true);

    GameState.nextPhase();

    expect(GameState.getIsVeryFirstTurn()).toBe(false);
    expect(GameState.getCurrentTurn()).toBe(PLAYER_TWO);
    expect(GameState.getTurnPhase()).toBe(CAPTURE);
    expect(GameState.getNumberOfTurnsIntoGame()).toBe(1);
  });

  it("each later turn is capture, then stack-or-capture-or-pass, then the other player", () => {
    GameState.nextPhase(); // first turn done -> player two capture

    GameState.nextPhase();
    expect(GameState.getCurrentTurn()).toBe(PLAYER_TWO);
    expect(GameState.getTurnPhase()).toBe(STACK_OR_CAPTURE_OR_PASS);

    GameState.nextPhase();
    expect(GameState.getCurrentTurn()).toBe(PLAYER_ONE);
    expect(GameState.getTurnPhase()).toBe(CAPTURE);
    expect(GameState.getNumberOfTurnsIntoGame()).toBe(2);

    GameState.nextPhase();
    expect(GameState.getCurrentTurn()).toBe(PLAYER_ONE);
    expect(GameState.getTurnPhase()).toBe(STACK_OR_CAPTURE_OR_PASS);

    GameState.nextPhase();
    expect(GameState.getCurrentTurn()).toBe(PLAYER_TWO);
    expect(GameState.getTurnPhase()).toBe(CAPTURE);
    expect(GameState.getNumberOfTurnsIntoGame()).toBe(3);
  });
});

describe("GameState board copies", () => {
  it("copies every playable vertex into a new object", () => {
    const board = setupSymmetricalBoard();
    const copy = GameState.getBoardGameStateCopy(board);

    expect(copy).not.toBe(board);
    expect(Object.keys(copy).sort()).toEqual([...PLAYABLE_VERTICES].sort());
    for (const coordinate of PLAYABLE_VERTICES) {
      expect(copy[coordinate]).toBe(board[coordinate]);
    }
  });
});

describe("GameState winner messages", () => {
  it("tells a human first player they won", () => {
    GameState.setIsFirstPlayerAI(false);
    GameState.setIsSecondPlayerAI(true);
    expect(GameState.getWinnerMessage(PLAYER_ONE)).toBe("You won!");
  });

  it("names the AI when it wins as player two", () => {
    GameState.setIsFirstPlayerAI(false);
    GameState.setIsSecondPlayerAI(true);
    expect(GameState.getWinnerMessage(PLAYER_TWO)).toBe(
      "Winner: PLAYER_TWO (AI)"
    );
  });
});
