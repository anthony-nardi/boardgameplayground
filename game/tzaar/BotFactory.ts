import { PLAYER_TWO, PLAYER_ONE, AI_ANIMATION_DURATION } from "./constants";
import { drawGameBoardState, renderMovingPiece } from "./renderHelpers";
import { getPixelCoordinatesFromBoardCoordinates } from "./gameBoardHelpers";
import {
  gameBoardState,
  setNewgameBoardState,
  nextPhase,
  currentTurn,
  isFirstPlayerAI,
  isSecondPlayerAI,
  isVeryFirstTurn,
} from "./gameState";
import { getGameStatesToAnalyze } from "./moves";
import * as minimaxer from "minimaxer";
import { Player, ValidCoordinate } from "./types/types";
import { hideLoadingSpinner } from "./domHelpers";
import { checkGameStateAndStartNextTurn } from "./gameLogic";
import EvaluationFactory from "./EvaluationFactory";
import { getWinner } from "./evaluationHelpers";

export function applyMoveToGameState(gamestate: any, move: string) {
  // dont render moving piece in the same spot...
  const updatedBoardGameState = {
    "0,4": gamestate["0,4"],
    "0,5": gamestate["0,5"],
    "0,6": gamestate["0,6"],
    "0,7": gamestate["0,7"],
    "0,8": gamestate["0,8"],
    "1,3": gamestate["1,3"],
    "1,4": gamestate["1,4"],
    "1,5": gamestate["1,5"],
    "1,6": gamestate["1,6"],
    "1,7": gamestate["1,7"],
    "1,8": gamestate["1,8"],
    "2,2": gamestate["2,2"],
    "2,3": gamestate["2,3"],
    "2,4": gamestate["2,4"],
    "2,5": gamestate["2,5"],
    "2,6": gamestate["2,6"],
    "2,7": gamestate["2,7"],
    "2,8": gamestate["2,8"],
    "3,1": gamestate["3,1"],
    "3,2": gamestate["3,2"],
    "3,3": gamestate["3,3"],
    "3,4": gamestate["3,4"],
    "3,5": gamestate["3,5"],
    "3,6": gamestate["3,6"],
    "3,7": gamestate["3,7"],
    "3,8": gamestate["3,8"],
    "4,0": gamestate["4,0"],
    "4,1": gamestate["4,1"],
    "4,2": gamestate["4,2"],
    "4,3": gamestate["4,3"],
    "4,5": gamestate["4,5"],
    "4,6": gamestate["4,6"],
    "4,7": gamestate["4,7"],
    "4,8": gamestate["4,8"],
    "5,0": gamestate["5,0"],
    "5,1": gamestate["5,1"],
    "5,2": gamestate["5,2"],
    "5,3": gamestate["5,3"],
    "5,4": gamestate["5,4"],
    "5,5": gamestate["5,5"],
    "5,6": gamestate["5,6"],
    "5,7": gamestate["5,7"],
    "6,0": gamestate["6,0"],
    "6,1": gamestate["6,1"],
    "6,2": gamestate["6,2"],
    "6,3": gamestate["6,3"],
    "6,4": gamestate["6,4"],
    "6,5": gamestate["6,5"],
    "6,6": gamestate["6,6"],
    "7,0": gamestate["7,0"],
    "7,1": gamestate["7,1"],
    "7,2": gamestate["7,2"],
    "7,3": gamestate["7,3"],
    "7,4": gamestate["7,4"],
    "7,5": gamestate["7,5"],
    "8,0": gamestate["8,0"],
    "8,1": gamestate["8,1"],
    "8,2": gamestate["8,2"],
    "8,3": gamestate["8,3"],
    "8,4": gamestate["8,4"],
  } as any;

  // Single move only
  if (move.indexOf("=>") === -1) {
    const [firstFromCoordinate, firstToCoordinate] = move.split("->");
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

  const firstFromCoordinate = move.slice(0, 3);
  const firstToCoordinate = move.slice(5, 8);
  const secondFromCoordinate = move.slice(10, 13);
  const secondToCoordinate = move.slice(15, 18);

  const firstFromPiece = gamestate[firstFromCoordinate];

  updatedBoardGameState[firstFromCoordinate] = false;

  updatedBoardGameState[firstToCoordinate] = {
    isDragging: firstFromPiece.isDragging,
    ownedBy: firstFromPiece.ownedBy,
    stackSize: firstFromPiece.stackSize,
    type: firstFromPiece.type,
  };

  const secondFromPiece = updatedBoardGameState[secondFromCoordinate];

  updatedBoardGameState[secondFromCoordinate] = false;

  const toPiece = updatedBoardGameState[secondToCoordinate];

  if (secondFromPiece.ownedBy === toPiece.ownedBy) {
    const updatedSecondFromPiece = {
      isDragging: secondFromPiece.isDragging,
      ownedBy: secondFromPiece.ownedBy,
      stackSize: secondFromPiece.stackSize,
      type: secondFromPiece.type,
    };

    updatedSecondFromPiece.stackSize =
      secondFromPiece.stackSize + toPiece.stackSize;

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

  public moveAI(moveAiCallback: Function) {
    const winner = getWinner(gameBoardState);

    if (winner) {
      let message = winner === PLAYER_TWO ? "You lost." : "You won!";
      // alert(`${message}`);
      console.log("WINNER ", winner);

      return null;
    }

    const evalFunction = (
      gameState: typeof gameBoardState,
      playerToMaximize: typeof PLAYER_ONE | typeof PLAYER_TWO,
      winner?: Player,
      debug?: boolean
    ) => {
      return this.evaluation.getGameStateScore(
        gameState,
        playerToMaximize,
        winner,
        debug
      );
    };

    const now = Date.now();
    const opts = new minimaxer.NegamaxOpts();

    const allPossibleStatesAfterTurn = Object.keys(
      getGameStatesToAnalyze(gameBoardState, currentTurn, isVeryFirstTurn)
    );

    console.log(
      `All possible starting moves: ${allPossibleStatesAfterTurn.length}`
    );
    opts.depth =
      allPossibleStatesAfterTurn.length < 1000 && !isVeryFirstTurn ? 2 : 1;
    // opts.expireTime = 5000;
    opts.method = 2;
    // opts.method = 3;
    opts.pruning = 1;
    opts.sortMethod = 0;
    opts.genBased = false;
    opts.optimal = false;
    // opts.timeout = 10000;
    // console.log("DEPTH is " + opts.depth);

    let aim = 1;
    let data = { nextPlayerToMaximize: currentTurn, winner: undefined };
    let move = null;
    const nodeType = 0;
    const root = new minimaxer.Node(
      nodeType,
      gameBoardState,
      move,
      data,
      aim,
      allPossibleStatesAfterTurn
    );
    const tree = new minimaxer.Negamax(root, opts);

    // @ts-expect-error Figure out. TODO
    tree.CreateChildNode = this.createChildCallback;

    tree.EvaluateNode = (node) => {
      const gamestateToAnalyze = node.gamestate;

      const score = evalFunction(
        gamestateToAnalyze,
        node.data.nextPlayerToMaximize,
        node.data.winner,
        false
      );
      return score;
    };

    tree.GetMoves = (node) => {
      const gamestateToAnalyze = node.gamestate;

      const moves = Object.keys(
        getGameStatesToAnalyze(
          gamestateToAnalyze,
          node.data.nextPlayerToMaximize
        )
      );

      return moves;
    };

    const result = tree.evaluate();

    console.log(result);
    const elapsed = Date.now() - now;
    console.log("Took %d ms", elapsed);
    // @ts-expect-error fix TODO

    this.playMove(result.move, moveAiCallback);

    hideLoadingSpinner();
  }

  private playMove(move: string, moveAiCallback: Function) {
    if (currentTurn === PLAYER_ONE && !isFirstPlayerAI) {
      throw new Error("playMove should not happen for a human player");
    }
    if (currentTurn === PLAYER_TWO && !isSecondPlayerAI) {
      throw new Error("playMove should not happen for a human player");
    }
    if (
      window.localStorage &&
      window.localStorage.getItem("DEBUG_TZAAR") === "true"
    ) {
      // console.log(gameBoardState.toJS());
    }
    // Single move only
    if (move.indexOf("=>") === -1) {
      const [firstFromCoordinate, firstToCoordinate] = move.split("->");

      const fromCoordinate = firstFromCoordinate as ValidCoordinate;
      const toCoordinate = firstToCoordinate as ValidCoordinate;

      const fromPiece = gameBoardState[fromCoordinate];
      const updatedBoardGameState = Object.assign({}, gameBoardState);
      updatedBoardGameState[fromCoordinate] = false;
      setNewgameBoardState(updatedBoardGameState);
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
          const updatedGameBoardState = Object.assign({}, gameBoardState);
          updatedGameBoardState[toCoordinate] = Object.assign({}, fromPiece);
          setNewgameBoardState(updatedGameBoardState);
          checkGameStateAndStartNextTurn();
          checkGameStateAndStartNextTurn();
          drawGameBoardState();

          const shouldAIMakeNextMove =
            (currentTurn === PLAYER_TWO && isSecondPlayerAI) ||
            (currentTurn === PLAYER_ONE && isFirstPlayerAI);

          if (shouldAIMakeNextMove) {
            setTimeout(moveAiCallback, 50);
          }
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

    const fromPiece = gameBoardState[fromCoordinate];

    let updatedBoardGameState = Object.assign({}, gameBoardState);
    updatedBoardGameState[fromCoordinate] = false;
    setNewgameBoardState(updatedBoardGameState);

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

        nextPhase();

        const secondFromPiece = updatedBoardGameState[fromCoordinate2];

        if (!secondFromPiece) {
          throw new Error("no secondFromPiece");
        }
        updatedBoardGameState = Object.assign({}, updatedBoardGameState);
        updatedBoardGameState[fromCoordinate2] = false;
        setNewgameBoardState(updatedBoardGameState);

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
              setNewgameBoardState(updatedBoardGameState);
            } else {
              updatedBoardGameState = Object.assign({}, updatedBoardGameState);
              updatedBoardGameState[toCoordinate2] = secondFromPiece;
              setNewgameBoardState(updatedBoardGameState);
            }

            checkGameStateAndStartNextTurn();
            drawGameBoardState();
            const shouldAIMakeNextMove =
              (currentTurn === PLAYER_TWO && isSecondPlayerAI) ||
              (currentTurn === PLAYER_ONE && isFirstPlayerAI);

            if (shouldAIMakeNextMove) {
              setTimeout(moveAiCallback, 50);
            }
          }
        );
      }
    );
  }

  private createChildCallback(node: any, move: string) {
    const gamestateToAnalyze = node.gamestate;

    let turn;
    let aim;

    if (!node.parent) {
      turn = node.data.nextPlayerToMaximize;
      aim = 1;
    } else {
      turn =
        node.data.nextPlayerToMaximize === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
      aim = node.parent.aim * -1;
    }

    const updatedBoardGameState = applyMoveToGameState(
      gamestateToAnalyze,
      move
    );

    const winner = getWinner(updatedBoardGameState);

    const nodeType = winner ? 2 : 1;

    const childNode = new minimaxer.Node(
      nodeType,
      updatedBoardGameState,
      move,
      { nextPlayerToMaximize: turn, winner },
      aim
    );

    return childNode;
  }
}
