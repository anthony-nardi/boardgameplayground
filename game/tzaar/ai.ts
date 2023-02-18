import { PLAYER_TWO, PLAYER_ONE } from "./constants";
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
import * as evaluation from "./evaluation";
import * as minimaxer from "minimaxer";
import { ValidCoordinate } from "./types/types";
import { hideLoadingSpinner } from "./domHelpers";
import { checkGameStateAndStartNextTurn } from "./gameLogic";

export const createChildCallback = (node: any, move: string) => {
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

  const updatedBoardGameState = applyMoveToGameState(gamestateToAnalyze, move);

  const winner = evaluation.getWinner(updatedBoardGameState);

  const nodeType = winner ? 2 : 1;

  const childNode = new minimaxer.Node(
    nodeType,
    updatedBoardGameState,
    move,
    { nextPlayerToMaximize: turn },
    aim
  );
  return childNode;
};

export function moveAI() {
  console.log("MOVING AI...");
  if (
    (currentTurn === PLAYER_ONE && !isFirstPlayerAI) ||
    (currentTurn === PLAYER_TWO && !isSecondPlayerAI)
  ) {
    return;
  }

  const now = Date.now();
  const opts = new minimaxer.NegamaxOpts();

  const allPossibleStatesAfterTurn = getGameStatesToAnalyze(
    gameBoardState,
    currentTurn,
    isVeryFirstTurn
  )
    .keySeq()
    // @ts-expect-error this works
    .sort((a, b) => (a.length < b.length ? -1 : 1))
    .toJS();

  console.log(
    `All possible starting moves: ${allPossibleStatesAfterTurn.length}`
  );
  opts.depth =
    allPossibleStatesAfterTurn.length < 400 && !isVeryFirstTurn ? 2 : 1;

  opts.method = 0;
  opts.pruning = 1;
  opts.sortMethod = 0;
  opts.genBased = false;
  opts.optimal = false;
  console.log("DEPTH is " + opts.depth);

  let aim = 1;
  let data = { nextPlayerToMaximize: currentTurn };
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
  tree.CreateChildNode = createChildCallback;

  tree.EvaluateNode = (node) => {
    const gamestateToAnalyze = node.gamestate;

    const score = evaluation.getGameStateScore(
      gamestateToAnalyze,
      node.data.nextPlayerToMaximize,
      false
    );
    return score;
  };

  tree.GetMoves = (node) => {
    const gamestateToAnalyze = node.gamestate;

    const moves = getGameStatesToAnalyze(
      gamestateToAnalyze,
      node.data.nextPlayerToMaximize
    )
      .keySeq()
      .toJS();

    return moves;
  };

  const result = tree.evaluate();

  console.log(result);
  const elapsed = Date.now() - now;
  console.log("Took %d ms", elapsed);
  // @ts-expect-error fix TODO

  playMove(result.move);

  hideLoadingSpinner();
}

export function applyMoveToGameState(gamestate: any, move: string) {
  // Single move only
  if (move.indexOf("=>") === -1) {
    const [firstFromCoordinate, firstToCoordinate] = move.split("->");
    const fromPiece = gamestate.get(firstFromCoordinate);
    return gamestate
      .set(firstFromCoordinate, false)
      .set(firstToCoordinate, fromPiece);
  }

  const [firstMove, secondMove] = move.split("=>");
  const [firstFromCoordinate, firstToCoordinate] = firstMove.split("->");
  const [secondFromCoordinate, secondToCoordinate] = secondMove.split("->");
  const fromPiece = gamestate.get(firstFromCoordinate);

  // dont render moving piece in the same spot...
  let updatedBoardGameState = gamestate.set(firstFromCoordinate, false);

  updatedBoardGameState = updatedBoardGameState.set(
    firstToCoordinate,
    fromPiece
  );

  const secondFromPiece = updatedBoardGameState.get(secondFromCoordinate);
  updatedBoardGameState = updatedBoardGameState.set(
    secondFromCoordinate,
    false
  );

  const toPiece = updatedBoardGameState.get(secondToCoordinate);

  if (secondFromPiece.ownedBy === toPiece.ownedBy) {
    updatedBoardGameState = updatedBoardGameState
      .set(secondToCoordinate, secondFromPiece)
      .setIn(
        [secondToCoordinate, "stackSize"],
        secondFromPiece.stackSize + toPiece.stackSize
      );
  } else {
    updatedBoardGameState = updatedBoardGameState.set(
      secondToCoordinate,
      secondFromPiece
    );
  }

  return updatedBoardGameState;
}

export function playMove(move: string) {
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
    console.log(gameBoardState.toJS());
  }
  // Single move only
  if (move.indexOf("=>") === -1) {
    const [firstFromCoordinate, firstToCoordinate] = move.split("->");

    const fromCoordinate = firstFromCoordinate as ValidCoordinate;
    const toCoordinate = firstToCoordinate as ValidCoordinate;

    const fromPiece = gameBoardState.get(fromCoordinate);
    setNewgameBoardState(gameBoardState.set(fromCoordinate, false));
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
      2000,
      Date.now(),
      () => {
        setNewgameBoardState(gameBoardState.set(toCoordinate, fromPiece));
        checkGameStateAndStartNextTurn();
        checkGameStateAndStartNextTurn();
        drawGameBoardState();

        const shouldAIMakeNextMove =
          (currentTurn === PLAYER_TWO && isSecondPlayerAI) ||
          (currentTurn === PLAYER_ONE && isFirstPlayerAI);

        if (shouldAIMakeNextMove) {
          setTimeout(() => moveAI(), 50);
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

  const fromPiece = gameBoardState.get(fromCoordinate);

  // dont render moving piece in the same spot...
  setNewgameBoardState(gameBoardState.set(fromCoordinate, false));
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
    2000,
    Date.now(),
    () => {
      setNewgameBoardState(gameBoardState.set(toCoordinate, fromPiece));

      nextPhase();

      const secondFromPiece = gameBoardState.get(fromCoordinate2);

      if (!secondFromPiece) {
        throw new Error("no secondFromPiece");
      }

      setNewgameBoardState(gameBoardState.set(fromCoordinate2, false));

      renderMovingPiece(
        secondFromPiece,
        fromSecondPixelCoodinate,
        toSecondPixelCoordinate,
        2000,
        Date.now(),
        () => {
          const toPiece = gameBoardState.get(toCoordinate2);
          if (!toPiece) {
            throw new Error("no toPiece");
          }
          if (secondFromPiece.ownedBy === toPiece.ownedBy) {
            setNewgameBoardState(
              gameBoardState
                .set(toCoordinate2, secondFromPiece)
                .setIn(
                  [secondToCoordinate, "stackSize"],
                  secondFromPiece.stackSize + toPiece.stackSize
                )
            );
          } else {
            setNewgameBoardState(
              gameBoardState.set(toCoordinate2, secondFromPiece)
            );
          }

          checkGameStateAndStartNextTurn();
          drawGameBoardState();
          const shouldAIMakeNextMove =
            (currentTurn === PLAYER_TWO && isSecondPlayerAI) ||
            (currentTurn === PLAYER_ONE && isFirstPlayerAI);

          if (shouldAIMakeNextMove) {
            setTimeout(() => moveAI(), 50);
          }
        }
      );
    }
  );
}
