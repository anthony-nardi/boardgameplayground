import { PLAYER_TWO, PLAYER_ONE } from "../constants";
import GameState from "./GameState";
import { getGameStatesToAnalyze } from "./availableMovesGenerator";
import * as minimaxer from "minimaxer";
import { ValidCoordinate } from "../types/types";
import { hideLoadingSpinner } from "../rendering/domHelpers";
import EvaluationFactory from "./EvaluationFactory";
import { getWinner } from "./evaluationHelpers";

export function applyMoveToGameState(gamestate: any, move: string) {}

export default class BotFactory {
  constructor(
    props: {
      VERSION: number;
    } = {
      VERSION: 1,
    }
  ) {
    this.evaluation = new EvaluationFactory(props);

    this.VERSION = props.VERSION;

    console.log(`Bot version: ${this.VERSION}`);
  }

  private VERSION: number;
  public evaluation: EvaluationFactory;

  private getScore(node: any) {}

  private getOpts() {
    const opts = new minimaxer.NegamaxOpts();

    let depth = 1;

    if (GameState.getNumberOfTurnsIntoGame() > 1) {
      depth = 999;
    }

    if (GameState.getNumberOfTurnsIntoGame() < 5) {
      opts.timeout = 3000;
    } else {
      opts.timeout = 6000;
    }

    // TODO: optimal seems to be less performance (very slightly)
    // Probably best to play around with options at different points
    // in the game.
    opts.depth = depth;
    opts.method = 3;
    opts.presort = true;
    opts.pruning = 1;
    opts.sortMethod = 2;
    opts.genBased = true;
    opts.optimal = false;
    opts.pruneByPathLength = true;
    return opts;
  }

  private getRootNode(allPossibleStatesAfterTurn: string[]) {}

  private firstCheckIfWinner() {
    return false;
  }

  public moveAIRingPlacement() {
    const gameState = GameState.getGameBoardState();
    const possibleMoves = [];
    for (let coordinate in gameState) {
      // @ts-expect-error fix
      if (gameState[coordinate] === false) {
        possibleMoves.push(coordinate);
      }
    }
    const coordinateToPlaceRing = possibleMoves[
      Math.floor(Math.random() * possibleMoves.length)
    ] as ValidCoordinate;

    if (GameState.getCurrentTurn() === PLAYER_ONE) {
      GameState.setPlayerOneRing(coordinateToPlaceRing);
    } else {
      GameState.setPlayerTwoRing(coordinateToPlaceRing);
    }
  }
  public moveAIRingMovement() {}

  private getMovesCallback(node: any) {}

  private createChildCallback(node: any, move: string) {}
}
