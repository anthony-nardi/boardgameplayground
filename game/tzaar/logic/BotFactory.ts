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
        depth = 2;
      }
      if (totalStartingMoveCount < 500 && !EARLY_GAME) {
        depth = 3;
      }
      if (totalStartingMoveCount < 200 && !EARLY_GAME) {
        depth = 4;
      }
    }

    opts.depth = depth;
    opts.method = 2;
    opts.pruning = 1;
    opts.sortMethod = 0;
    opts.genBased = false;
    opts.optimal = false;

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
      GameState.getCurrentTurn()
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
    // @ts-expect-error fix TODO
    this.playMove(result.move, moveAiCallback);

    hideLoadingSpinner();
  }

  public playMove(move: string, moveAiCallback: Function) {
    // if (
    //   GameState.getCurrentTurn() === PLAYER_ONE &&
    //   !GameState.getIsFirstPlayerAI()
    // ) {
    //   throw new Error("playMove should not happen for a human player");
    // }
    // if (
    //   GameState.getCurrentTurn() === PLAYER_TWO &&
    //   !GameState.getIsSecondPlayerAI()
    // ) {
    //   throw new Error("playMove should not happen for a human player");
    // }
    if (isDebug()) {
      console.log(
        `Number of turns into game: ${GameState.getNumberOfTurnsIntoGame()}`
      );
      console.log(
        `Current turn: ${GameState.getCurrentTurn()} is making the move: ${move}`
      );
      console.log(GameState.getGameBoardState());
      addAIMoveToCurrentGame(move);
    }
    // Single move only
    if (move.indexOf("=>") === -1) {
      const [firstFromCoordinate, firstToCoordinate] = move.split("->");

      const fromCoordinate = firstFromCoordinate as ValidCoordinate;
      const toCoordinate = firstToCoordinate as ValidCoordinate;

      const fromPiece = GameState.getGameBoardState()[fromCoordinate];
      const updatedBoardGameState = Object.assign(
        {},
        GameState.getGameBoardState()
      );
      updatedBoardGameState[fromCoordinate] = false;
      GameState.setGameBoardState(updatedBoardGameState);
      const fromFirstPixelCoodinate =
        getPixelCoordinatesFromBoardCoordinates(fromCoordinate);
      const toFirstPixelCoordinate =
        getPixelCoordinatesFromBoardCoordinates(toCoordinate);

      if (!fromPiece) {
        throw new Error("No from piece");
      }

      renderMovingPiece(
        fromPiece,
        fromFirstPixelCoodinate,
        toFirstPixelCoordinate,
        AI_ANIMATION_DURATION,
        Date.now(),
        () => {
          const updatedGameBoardState = Object.assign(
            {},
            GameState.getGameBoardState()
          );
          updatedGameBoardState[toCoordinate] = Object.assign({}, fromPiece);
          GameState.setGameBoardState(updatedGameBoardState);
          checkGameStateAndStartNextTurn();
          checkGameStateAndStartNextTurn(true);
          drawGameBoardState();

          const shouldAIMakeNextMove =
            (GameState.getCurrentTurn() === PLAYER_TWO &&
              GameState.getIsSecondPlayerAI()) ||
            (GameState.getCurrentTurn() === PLAYER_ONE &&
              GameState.getIsFirstPlayerAI());

          // if (shouldAIMakeNextMove) {
          setTimeout(moveAiCallback, 50);
          // }
        }
      );
      return;
    }

    const [firstMove, secondMove] = move.split("=>");
    const [firstFromCoordinate, firstToCoordinate] = firstMove.split("->");
    const [secondFromCoordinate, secondToCoordinate] = secondMove.split("->");

    const fromCoordinate = firstFromCoordinate as ValidCoordinate;
    const toCoordinate = firstToCoordinate as ValidCoordinate;
    const fromCoordinate2 = secondFromCoordinate as ValidCoordinate;
    const toCoordinate2 = secondToCoordinate as ValidCoordinate;

    const fromPiece = GameState.getGameBoardState()[fromCoordinate];

    let updatedBoardGameState = Object.assign(
      {},
      GameState.getGameBoardState()
    );
    updatedBoardGameState[fromCoordinate] = false;
    GameState.setGameBoardState(updatedBoardGameState);

    const fromFirstPixelCoodinate =
      getPixelCoordinatesFromBoardCoordinates(fromCoordinate);
    const toFirstPixelCoordinate =
      getPixelCoordinatesFromBoardCoordinates(toCoordinate);

    const fromSecondPixelCoodinate =
      getPixelCoordinatesFromBoardCoordinates(fromCoordinate2);
    const toSecondPixelCoordinate =
      getPixelCoordinatesFromBoardCoordinates(toCoordinate2);

    if (!fromPiece) {
      throw new Error("No from Piece");
    }
    renderMovingPiece(
      fromPiece,
      fromFirstPixelCoodinate,
      toFirstPixelCoordinate,
      AI_ANIMATION_DURATION,
      Date.now(),
      () => {
        updatedBoardGameState = Object.assign({}, updatedBoardGameState);
        updatedBoardGameState[toCoordinate] = fromPiece;

        GameState.nextPhase();

        const secondFromPiece = updatedBoardGameState[fromCoordinate2];

        if (!secondFromPiece) {
          throw new Error("no secondFromPiece");
        }
        updatedBoardGameState = Object.assign({}, updatedBoardGameState);
        updatedBoardGameState[fromCoordinate2] = false;
        GameState.setGameBoardState(updatedBoardGameState);

        renderMovingPiece(
          secondFromPiece,
          fromSecondPixelCoodinate,
          toSecondPixelCoordinate,
          AI_ANIMATION_DURATION,
          Date.now(),
          () => {
            const toPiece = updatedBoardGameState[toCoordinate2];
            if (!toPiece) {
              throw new Error("no toPiece");
            }
            if (secondFromPiece.ownedBy === toPiece.ownedBy) {
              updatedBoardGameState = Object.assign({}, updatedBoardGameState);
              const secondFromPieceUpdated = Object.assign({}, secondFromPiece);
              secondFromPieceUpdated.stackSize =
                secondFromPiece.stackSize + toPiece.stackSize;
              updatedBoardGameState[toCoordinate2] = secondFromPieceUpdated;
              GameState.setGameBoardState(updatedBoardGameState);
            } else {
              updatedBoardGameState = Object.assign({}, updatedBoardGameState);
              updatedBoardGameState[toCoordinate2] = secondFromPiece;
              GameState.setGameBoardState(updatedBoardGameState);
            }

            checkGameStateAndStartNextTurn(true);
            drawGameBoardState();
            const shouldAIMakeNextMove =
              (GameState.getCurrentTurn() === PLAYER_TWO &&
                GameState.getIsSecondPlayerAI()) ||
              (GameState.getCurrentTurn() === PLAYER_ONE &&
                GameState.getIsFirstPlayerAI());

            // if (shouldAIMakeNextMove) {
            setTimeout(moveAiCallback, 50);
            // }
          }
        );
      }
    );
  }

  private createChildCallback(node: any, move: string) {
    const gamestateToAnalyze = node.gamestate;

    let turn;
    let aim;

    if (node.type === 0) {
      turn = node.data.turn;
      aim = node.aim;
    } else {
      turn = node.parent.data.turn === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
      aim = node.parent.aim * -1;
    }

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
      { turn, winner },
      aim
    );

    return childNode;
  }
}
