// gameLogic must load before BotFactory/EvaluationFactory: the three modules
// form an import cycle and gameLogic constructs bots at import time.
import "../gameLogic";
import { beforeEach, describe, expect, it } from "vitest";
import { PLAYER_ONE, PLAYER_TWO, TOTT, TZAAR, TZARRA } from "../../constants";
import EvaluationFactory from "../EvaluationFactory";
import { setupSymmetricalBoard } from "../gameBoardHelpers";
import GameState from "../GameState";
import { boardWith, piece } from "./testUtils";

const defaultWeights = {
  VERSION: 1,
  CORNER_PENALTY_MULTIPLIER: 1,
  COUNT_SCORE_MULTIPLIER: 1,
  EDGE_PENALTY_MULTIPLIER: 1,
  LARGEST_STACK_BONUS_MULTIPLIER: 1,
  SCORE_FOR_STACKS_THREATENED_MULTIPLIER: 1,
  STACK_SIZE_SCORE_MULTIPLIER: 1,
  STACK_VALUE_BONUS_MULTIPLIER: 1,
};

function node(gamestate: ReturnType<typeof boardWith>, winner?: string) {
  return { gamestate, data: { winner } };
}

describe("EvaluationFactory", () => {
  const evaluation = new EvaluationFactory(defaultWeights);

  beforeEach(() => {
    GameState.setCurrentTurn(PLAYER_ONE);
  });

  it("summarises stacks per player and type", () => {
    const metadata = evaluation.getGameStateMetadata(setupSymmetricalBoard());

    expect(metadata.PLAYER_ONE_TOTT_STACKS).toHaveLength(15);
    expect(metadata.PLAYER_ONE_TZARRA_STACKS).toHaveLength(9);
    expect(metadata.PLAYER_ONE_TZAAR_STACKS).toHaveLength(6);
    expect(metadata.PLAYER_TWO_TOTT_STACKS).toHaveLength(15);
    expect(metadata.PLAYER_TWO_TZARRA_STACKS).toHaveLength(9);
    expect(metadata.PLAYER_TWO_TZAAR_STACKS).toHaveLength(6);
  });

  it("scores a won or lost position as infinite", () => {
    const board = setupSymmetricalBoard();
    expect(evaluation.getGameStateScore(node(board, PLAYER_ONE))).toBe(
      Infinity
    );
    expect(evaluation.getGameStateScore(node(board, PLAYER_TWO))).toBe(
      -Infinity
    );
  });

  it("is antisymmetric between the two players", () => {
    const board = boardWith({
      "0,4": piece(PLAYER_ONE, TOTT, 1),
      "2,2": piece(PLAYER_ONE, TZAAR, 2),
      "8,0": piece(PLAYER_TWO, TZARRA, 3),
      "5,3": piece(PLAYER_TWO, TOTT, 1),
    });

    GameState.setCurrentTurn(PLAYER_ONE);
    const asPlayerOne = evaluation.getGameStateScore(node(board));
    GameState.setCurrentTurn(PLAYER_TWO);
    const asPlayerTwo = evaluation.getGameStateScore(node(board));

    expect(asPlayerOne).toBe(-asPlayerTwo);
  });

  it("prefers taller stacks and penalises edges and corners", () => {
    const baseline = boardWith({
      "5,3": piece(PLAYER_ONE, TOTT, 1),
      "3,5": piece(PLAYER_TWO, TOTT, 1),
    });
    const tallerStack = boardWith({
      "5,3": piece(PLAYER_ONE, TOTT, 2),
      "3,5": piece(PLAYER_TWO, TOTT, 1),
    });
    const onCorner = boardWith({
      "4,0": piece(PLAYER_ONE, TOTT, 1),
      "3,5": piece(PLAYER_TWO, TOTT, 1),
    });
    const onEdge = boardWith({
      "5,0": piece(PLAYER_ONE, TOTT, 1),
      "3,5": piece(PLAYER_TWO, TOTT, 1),
    });

    const score = (b: ReturnType<typeof boardWith>) =>
      evaluation.getGameStateScore(node(b));

    expect(score(baseline)).toBe(0);
    expect(score(tallerStack)).toBeGreaterThan(score(baseline));
    expect(score(onEdge)).toBeLessThan(score(baseline));
    expect(score(onCorner)).toBeLessThan(score(onEdge));
  });
});
