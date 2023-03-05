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

function applyMoveToGameState(gamestate: any, move: string) {
  // Single move only
  if (move.indexOf("=>") === -1) {
    const [firstFromCoordinate, firstToCoordinate] = move.split("->");
    const fromPiece = gamestate[firstFromCoordinate];
    const newGameState = Object.assign({}, gamestate);
    newGameState[firstFromCoordinate] = false;
    newGameState[firstToCoordinate] = Object.assign({}, fromPiece);

    return newGameState;
  }

  const [firstMove, secondMove] = move.split("=>");
  const [firstFromCoordinate, firstToCoordinate] = firstMove.split("->");
  const [secondFromCoordinate, secondToCoordinate] = secondMove.split("->");
  const fromPiece = gamestate[firstFromCoordinate];

  // dont render moving piece in the same spot...
  const updatedBoardGameState = Object.assign({}, gamestate);
  updatedBoardGameState[firstFromCoordinate] = false;

  updatedBoardGameState[firstToCoordinate] = Object.assign({}, fromPiece);

  const secondFromPiece = updatedBoardGameState[secondFromCoordinate];

  updatedBoardGameState[secondFromCoordinate] = false;

  const toPiece = updatedBoardGameState[secondToCoordinate];

  if (secondFromPiece.ownedBy === toPiece.ownedBy) {
    const updatedSecondFromPiece = Object.assign({}, secondFromPiece);
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
