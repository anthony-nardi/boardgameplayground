import { PLAYER_TWO, PLAYER_ONE, TURN_PHASES } from "./constants";
import { drawInitialGrid } from "./cachedBoard";
import {
  drawCoordinates,
  drawGameBoardState,
  drawGamePiece,
  renderMovingPiece,
  renderInitializingBoard,
} from "./renderHelpers";
import {
  getBoardCoordinatesFromPixelCoordinates,
  getPixelCoordinatesFromBoardCoordinates,
  setupSymmetricalBoard,
  setupRandomBoard,
  getValidCaptures,
  getValidStacks,
} from "./gameBoardHelpers";
import {
  movingPiece,
  gameBoardState,
  setNewgameBoardState,
  setMovingPiece,
  nextPhase,
  currentTurn,
  turnPhase,
} from "./gameState";
import { getGameStatesToAnalyze } from "./moves";
import * as evaluation from "./evaluation";
import * as minimaxer from "minimaxer";
import React from "react";
import { ValidCoordinate } from "./types/types";
import {
  getPixelCoordinatesFromUserInteraction,
  getBoardCoordinatesFromUserInteraction,
} from "./coordinateHelpers";
import {
  showSkipButton,
  hideSkipButton,
  showLoadingSpinner,
  hideLoadingSpinner,
} from "./domHelpers";

function isCurrentPlayerPiece(boardCoordinate: ValidCoordinate) {
  return gameBoardState.getIn([boardCoordinate, "ownedBy"]) === currentTurn;
}

export function passTurn() {
  const canPass =
    currentTurn === PLAYER_ONE &&
    turnPhase === TURN_PHASES.STACK_OR_CAPTURE_OR_PASS;

  if (canPass) {
    nextPhase();
    hideSkipButton();
    showLoadingSpinner();
    setTimeout(moveAI);
  }
}

export function handleClickPiece(event: React.MouseEvent<HTMLCanvasElement>) {
  const boardCoordinate = getBoardCoordinatesFromUserInteraction(event);

  if (!isCurrentPlayerPiece(boardCoordinate)) {
    return;
  }

  if (currentTurn === PLAYER_TWO) {
    return;
  }

  setNewgameBoardState(
    gameBoardState.setIn([boardCoordinate, "isDragging"], true)
  );

  setMovingPiece(boardCoordinate);
}

export function handleMovePiece(event: React.MouseEvent<HTMLCanvasElement>) {
  if (!movingPiece) {
    return;
  }

  const gamePiece = gameBoardState.get(movingPiece);

  if (!gamePiece) {
    throw new Error("gamepiece not here");
  }

  const [x, y] = getPixelCoordinatesFromUserInteraction(event);

  drawGameBoardState();

  drawGamePiece(gamePiece, x, y);
}

export function handleDropPiece(event: React.MouseEvent<HTMLCanvasElement>) {
  if (!movingPiece) {
    return;
  }

  const toCoordinates = getBoardCoordinatesFromUserInteraction(event);

  setNewgameBoardState(
    gameBoardState.setIn([movingPiece, "isDragging"], false)
  );

  if (!gameBoardState.get(toCoordinates)) {
    setMovingPiece(null);
    drawGameBoardState();
    return;
  }

  const validCaptures = getValidCaptures(movingPiece, gameBoardState);
  const validStacks = getValidStacks(movingPiece, gameBoardState);
  const isValidCapture = validCaptures.includes(toCoordinates);
  const isValidStack = validStacks.includes(toCoordinates);

  if (isValidCapture) {
    capturePiece(movingPiece, toCoordinates);
  }

  if (isValidStack && turnPhase === TURN_PHASES.STACK_OR_CAPTURE_OR_PASS) {
    stackPiece(movingPiece, toCoordinates);
  }

  setMovingPiece(null);
  drawGameBoardState();

  const isNextPlayersTurn =
    turnPhase === TURN_PHASES.CAPTURE && currentTurn === PLAYER_TWO;

  if (isNextPlayersTurn) {
    showLoadingSpinner();
    setTimeout(() => moveAI(), 50);
  }
}

function capturePiece(
  fromCoordinates: ValidCoordinate,
  toCoordinates: ValidCoordinate
) {
  const fromPiece = gameBoardState.get(fromCoordinates);

  if (!fromPiece) {
    throw new Error("fromPiece not there.");
  }

  setNewgameBoardState(
    gameBoardState.set(fromCoordinates, false).set(toCoordinates, fromPiece)
  );
  checkGameStateAndStartNextTurn(true);
}

function stackPiece(
  fromCoordinates: ValidCoordinate,
  toCoordinates: ValidCoordinate
) {
  const fromPiece = gameBoardState.get(fromCoordinates);
  const toPiece = gameBoardState.get(toCoordinates);

  if (!fromPiece || !toPiece) {
    throw new Error("Stacking broken");
  }

  setNewgameBoardState(
    gameBoardState
      .set(fromCoordinates, false)
      .set(toCoordinates, fromPiece)
      .setIn(
        [toCoordinates, "stackSize"],
        fromPiece.stackSize + toPiece.stackSize
      )
  );
  checkGameStateAndStartNextTurn();
}

function checkGameStateAndStartNextTurn(shouldCheckWinner = false) {
  nextPhase();
  let winner;

  if (turnPhase === TURN_PHASES.CAPTURE || shouldCheckWinner) {
    winner = evaluation.getWinner(gameBoardState, true);
  }

  let message = winner === PLAYER_TWO ? "You lost." : "You won!";
  if (winner) {
    alert(`${message}`);
    location.reload();
  }
}

export const createChildCallback = (node: any, move: string) => {
  let gamestateToAnalyze;

  if (!node.gamestate.gamestate) {
    gamestateToAnalyze = node.gamestate;
  } else {
    gamestateToAnalyze = node.gamestate.gamestate;
  }

  const data = node.parent ? node.parent.data + 1 : 1;
  const aim = data === 0 ? 1 : -1;

  if (data === 0 && aim === -1) {
    throw new Error("Hmm no? Right??");
  }

  const updatedBoardGameState = applyMoveToGameState(gamestateToAnalyze, move);

  const winner = evaluation.getWinner(updatedBoardGameState);

  // if (move === "4,3->7,0=>8,2->8,3") {
  //   debugger;
  //   evaluation.getWinner(updatedBoardGameState);
  // }

  // ai kills itself

  // if (move === "0,5->0,6=>5,1->0,6") {
  //   debugger;
  //   evaluation.getWinner(updatedBoardGameState);
  // }

  const nodeType = winner ? 2 : 1;

  const childNode = new minimaxer.Node(
    nodeType,
    updatedBoardGameState,
    move,
    data,
    aim
  );
  return childNode;
};

function moveAI() {
  console.log(`MOVE AI`);
  if (currentTurn !== PLAYER_TWO) {
    return;
  }

  const now = Date.now();
  const opts = new minimaxer.NegamaxOpts();

  const loadingSpinnerComponent = document.getElementById("loadingSpinner");

  const allPossibleStatesAfterTurn = getGameStatesToAnalyze(
    gameBoardState,
    PLAYER_TWO
  )
    .keySeq()
    // @ts-expect-error this works
    .sort((a, b) => (a.length < b.length ? -1 : 1))
    .toJS();

  console.log(
    `All possible starting moves: ${allPossibleStatesAfterTurn.length}`
  );
  opts.depth = allPossibleStatesAfterTurn.length < 400 ? 2 : 1;
  opts.method = 0;
  opts.pruning = 1;
  opts.sortMethod = 0;
  opts.genBased = false;
  opts.optimal = false;
  console.log("DEPTH is " + opts.depth);

  let aim = 1;
  let data = 0;
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
    let gamestateToAnalyze;
    // if (node.move === "0,5->0,6=>5,1->0,6") {
    //   debugger;
    //   // evaluation.getWinner(updatedBoardGameState);
    // }
    // @ts-expect-error TODO
    if (!node.gamestate.gamestate) {
      gamestateToAnalyze = node.gamestate;
    } else {
      // @ts-expect-error TODO
      gamestateToAnalyze = node.gamestate.gamestate;
    }

    const scoreForNode = evaluation.getGameStateScore(gamestateToAnalyze);
    return scoreForNode;
  };
  tree.GetMoves = (gamestate) => {
    const gamestateToAnalyze = gamestate.gamestate;

    const player = gamestate.data % 2 === 1 ? PLAYER_ONE : PLAYER_TWO;

    const moves = getGameStatesToAnalyze(gamestateToAnalyze, player)
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

  if (loadingSpinnerComponent) {
    loadingSpinnerComponent.classList.add("hidden");
  }
}

function applyMoveToGameState(gamestate: any, move: string) {
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

function playMove(move: string) {
  if (currentTurn !== PLAYER_TWO) {
    return;
  }
  console.log(gameBoardState.toJS());
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
        }
      );
    }
  );
}

export function initGame(SETUP_STYLE: "RANDOM" | "SYMMETRIC" = "SYMMETRIC") {
  const piecesToSetup =
    SETUP_STYLE !== "RANDOM" ? setupSymmetricalBoard() : setupRandomBoard();

  drawInitialGrid();
  renderInitializingBoard(piecesToSetup, () => {
    drawGameBoardState();

    if (
      window.localStorage &&
      window.localStorage.getItem("DEBUG_TZAAR") === "true"
    ) {
      drawCoordinates();
    }
  });
}
