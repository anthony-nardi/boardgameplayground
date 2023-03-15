import { PLAYER_TWO, PLAYER_ONE, AI_ANIMATION_DURATION } from "../constants";
import {
  drawGameBoardState,
  renderMovingPiece,
} from "../rendering/renderHelpers";
import { getPixelCoordinatesFromBoardCoordinates } from "./gameBoardHelpers";
import GameState from "./gameState";
import { addAIMoveToCurrentGame } from "./gameHistory";
import { getGameStatesToAnalyze } from "./moves";
import * as minimaxer from "minimaxer";
import { ValidCoordinate } from "../types/types";
import { hideLoadingSpinner } from "../rendering/domHelpers";
import { checkGameStateAndStartNextTurn } from "./gameLogic";
import EvaluationFactory from "./EvaluationFactory";
import { getWinner } from "./evaluationHelpers";
import { isDebug } from "./utils";

export function applyMoveToGameState(gamestate: any, move: string) {
  // dont render moving piece in the same spot...
  const updatedBoardGameState = GameState.getBoardGameStateCopy(gamestate);
  // Single move only
  if (move.slice(8, 10) !== "=>") {
    const firstFromCoordinate = move.slice(0, 3) as ValidCoordinate;
    const firstToCoordinate = move.slice(5, 9) as ValidCoordinate;
    const fromPiece = gamestate[firstFromCoordinate];

    updatedBoardGameState[firstFromCoordinate] = false;
    updatedBoardGameState[firstToCoordinate] = {
      isDragging: fromPiece.isDragging,
      ownedBy: fromPiece.ownedBy,
      stackSize: fromPiece.stackSize,
      type: fromPiece.type,
    };
    return updatedBoardGameState;
  }

  const firstFromCoordinate = move.slice(0, 3) as ValidCoordinate;
  const firstToCoordinate = move.slice(5, 8) as ValidCoordinate;
  const secondFromCoordinate = move.slice(10, 13) as ValidCoordinate;
  const secondToCoordinate = move.slice(15, 18) as ValidCoordinate;

  const firstFromPiece = gamestate[firstFromCoordinate];

  updatedBoardGameState[firstFromCoordinate] = false;

  updatedBoardGameState[firstToCoordinate] = {
    isDragging: firstFromPiece.isDragging,
    ownedBy: firstFromPiece.ownedBy,
    stackSize: firstFromPiece.stackSize,
    type: firstFromPiece.type,
  };

  const secondFromPiece = updatedBoardGameState[secondFromCoordinate] as any;

  updatedBoardGameState[secondFromCoordinate] = false;

  const toPiece = updatedBoardGameState[secondToCoordinate] as any;

  if (secondFromPiece.ownedBy === toPiece.ownedBy) {
    const updatedSecondFromPiece = {
      isDragging: secondFromPiece.isDragging,
      ownedBy: secondFromPiece.ownedBy,
      stackSize: secondFromPiece.stackSize + toPiece.stackSize,
      type: secondFromPiece.type,
    };

    updatedBoardGameState[secondToCoordinate] = updatedSecondFromPiece;
  } else {
    updatedBoardGameState[secondToCoordinate] = secondFromPiece;
  }

  return updatedBoardGameState;
}

export default class BotFactory {
  constructor(props: {
    CORNER_PENALTY_MULTIPLIER: number;
    COUNT_SCORE_MULTIPLIER: number;
    EDGE_PENALTY_MULTIPLIER: number;
    LARGEST_STACK_BONUS_MULTIPLIER: number;
    SCORE_FOR_STACKS_THREATENED_MULTIPLIER: number;
    STACK_SIZE_SCORE_MULTIPLIER: number;
    STACK_VALUE_BONUS_MULTIPLIER: number;
    VERSION: number;
  }) {
    this.evaluation = new EvaluationFactory(props);

    this.VERSION = props.VERSION;
  }

  private VERSION: number;
  public evaluation: EvaluationFactory;

  private getScore(node: any) {
    return this.evaluation.getGameStateScore(node);
  }

  private getOpts(totalStartingMoveCount: number) {
    const opts = new minimaxer.NegamaxOpts();
    const EARLY_GAME = GameState.getNumberOfTurnsIntoGame() < 10;

    let depth = 1;
    if (GameState.getNumberOfTurnsIntoGame() > 1) {
      if (totalStartingMoveCount < 3000) {
        depth = 3;
      }
      if (totalStartingMoveCount < 500 && !EARLY_GAME) {
        depth = 5;
      }
      if (totalStartingMoveCount < 200 && !EARLY_GAME) {
        depth = 10;
      }
    }

    opts.timeout = 6000;
    opts.presort = true;
    opts.depth = depth;
    opts.method = 3;
    opts.pruning = 1;
    opts.sortMethod = 0;
    opts.genBased = false;
    opts.pruneByPathLength = true;
    opts.genBased = true;
    opts.optimal = true;

    return opts;
  }

  private getRootNode(allPossibleStatesAfterTurn: string[]) {
    const aim = 1;
    const data = { turn: GameState.getCurrentTurn(), winner: undefined };
    const move = null;
    const nodeType = 0;

    const root = new minimaxer.Node(
      nodeType,
      GameState.getGameBoardState(),
      move,
      data,
      aim,
      allPossibleStatesAfterTurn
    );

    return root;
  }

  private firstCheckIfWinner() {
    const winner = getWinner(
      GameState.getGameBoardState(),
      true,
      GameState.getCurrentTurn()
    );

    if (winner) {
      const message = GameState.getWinnerMessage(winner);
      console.log(
        message,
        `Number of turns into game: ${GameState.getNumberOfTurnsIntoGame()}`
      );
      return true;
    }
  }

  private getMovesCallback(node: any) {
    const turn = node.data.turn === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;

    const gamestateToAnalyze = node.gamestate;
    const moves = getGameStatesToAnalyze(gamestateToAnalyze, turn, true);

    if (moves.length === 0) {
      throw new Error(
        "THis shouldnt happen... moves is 0 so it should be a terminal game for minimax"
      );
    }

    return moves;
  }

  public moveAI(moveAiCallback: Function) {
    const winner = this.firstCheckIfWinner();

    if (winner) {
      return;
    }

    const now = Date.now();

    const allPossibleStatesAfterTurn = getGameStatesToAnalyze(
      GameState.getGameBoardState(),
      GameState.getCurrentTurn(),
      GameState.getNumberOfTurnsIntoGame() > 10
    );

    console.log(
      `All possible starting moves: ${
        allPossibleStatesAfterTurn.length
      } for ${GameState.getCurrentTurn()} on turn ${GameState.getNumberOfTurnsIntoGame()}`
    );

    const opts = this.getOpts(allPossibleStatesAfterTurn.length);
    const root = this.getRootNode(allPossibleStatesAfterTurn);
    const tree = new minimaxer.Negamax(root, opts);

    // @ts-expect-error Figure out. TODO
    tree.CreateChildNode = this.createChildCallback.bind(this);
    tree.EvaluateNode = this.getScore.bind(this);
    tree.GetMoves = this.getMovesCallback.bind(this);

    const result = tree.evaluate();

    console.log(result);
    const elapsed = Date.now() - now;

    console.log("Took %d ms", elapsed);

    if (result.move) {
      GameState.playMove(result.move, moveAiCallback);
    } else {
      throw new Error("Somehow, a move was not selected.");
    }

    hideLoadingSpinner();
  }

  private createChildCallback(node: any, move: string) {
    const gamestateToAnalyze = node.gamestate;

    let turn;
    // let aim;

    if (node.type === 0) {
      turn = node.data.turn;
      // aim = node.aim;
    } else {
      turn = node.parent.data.turn === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
      // aim = node.parent.aim * -1;
    }

    // if (aim === -1) {
    //   console.log("aimmmm");
    // }

    // console.log(node.aim);

    const updatedBoardGameState = applyMoveToGameState(
      gamestateToAnalyze,
      move
    );

    const winner = getWinner(updatedBoardGameState, false, turn);

    const nodeType = winner ? 2 : 1;

    const childNode = new minimaxer.Node(
      nodeType,
      updatedBoardGameState,
      move,
      { turn, winner }
      // aim
    );

    return childNode;
  }
}
