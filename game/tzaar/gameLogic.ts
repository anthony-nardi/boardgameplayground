import { PLAYER_TWO, PLAYER_ONE, TURN_PHASES } from "./constants";
import { drawInitialGrid } from "./cachedBoard";
import {
  drawCoordinates,
  drawGameBoardState,
  drawGamePiece,
  renderInitializingBoard,
} from "./renderHelpers";
import {
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
  setInitialGameState,
  isSecondPlayerAI,
  isFirstPlayerAI,
} from "./gameState";
import * as evaluation from "./evaluation";
import React from "react";
import { ValidCoordinate } from "./types/types";
import {
  getPixelCoordinatesFromUserInteraction,
  getBoardCoordinatesFromUserInteraction,
} from "./coordinateHelpers";
import { hideSkipButton, showLoadingSpinner } from "./domHelpers";
import { moveAI } from "./ai";
import { firstQuestionableMoveByAI } from './tests/QuestionableMoves'

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

  if (currentTurn === PLAYER_TWO && isSecondPlayerAI) {
    return;
  }

  if (currentTurn === PLAYER_ONE && isFirstPlayerAI) {
    return
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

export function checkGameStateAndStartNextTurn(shouldCheckWinner = false) {
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

export function initGame(SETUP_STYLE: "RANDOM" | "SYMMETRIC" = "SYMMETRIC") {
  const piecesToSetup =
    SETUP_STYLE !== "RANDOM" ? setupSymmetricalBoard() : setupRandomBoard();

  drawInitialGrid();

  renderInitializingBoard(piecesToSetup, () => {

    drawGameBoardState();

    if (currentTurn === PLAYER_ONE && isFirstPlayerAI) {
      moveAI();
    }

    if (
      window.localStorage &&
      window.localStorage.getItem("DEBUG_TZAAR") === "true"
    ) {
      drawCoordinates();
    }
  });
}
