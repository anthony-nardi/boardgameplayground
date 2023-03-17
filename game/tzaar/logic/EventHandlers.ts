import { PLAYER_TWO, PLAYER_ONE, TURN_PHASES, CAPTURE } from "../constants";
import { drawGameBoardState, drawGamePiece } from "../rendering/renderHelpers";
import { getValidCaptures, getValidStacks } from "./gameBoardHelpers";
import GameState from "./GameState";
import React from "react";
import { ValidCoordinate } from "../types/types";
import {
  getPixelCoordinatesFromUserInteraction,
  getBoardCoordinatesFromUserInteraction,
} from "../rendering/coordinateHelpers";
import { hideSkipButton, showLoadingSpinner } from "../rendering/domHelpers";
import { getWinner } from "./evaluationHelpers";
import { checkGameStateAndStartNextTurn, moveAI } from "./gameLogic";
import { isDebugModeOn } from "./utils";
import GameHistory from "../utils/GameHistory";

function isCurrentPlayerPiece(boardCoordinate: ValidCoordinate) {
  const piece = GameState.getGameBoardState()[boardCoordinate];
  return piece && piece.ownedBy === GameState.getCurrentTurn();
}

export function capturePiece(
  fromCoordinates: ValidCoordinate,
  toCoordinates: ValidCoordinate
) {
  const gameBoardState = GameState.getGameBoardState();

  const fromPiece = gameBoardState[fromCoordinates];

  if (!fromPiece) {
    throw new Error("fromPiece not there.");
  }

  if (isDebugModeOn()) {
    if (GameState.getTurnPhase() === CAPTURE) {
      GameHistory.addFirstHumanMoveToCurrentGame(
        `${fromCoordinates}->${toCoordinates}`
      );
    } else {
      GameHistory.addSecondHumanMoveToCurrentGame(
        `${fromCoordinates}->${toCoordinates}`
      );
    }
  }

  gameBoardState[fromCoordinates] = false;
  gameBoardState[toCoordinates] = fromPiece;

  checkGameStateAndStartNextTurn(true, moveAI);
}

export function stackPiece(
  fromCoordinates: ValidCoordinate,
  toCoordinates: ValidCoordinate
) {
  const gameBoardState = GameState.getGameBoardState();

  const fromPiece = gameBoardState[fromCoordinates];
  const toPiece = gameBoardState[toCoordinates];

  if (!fromPiece || !toPiece) {
    throw new Error("Stacking broken");
  }

  if (isDebugModeOn()) {
    GameHistory.addSecondHumanMoveToCurrentGame(
      `${fromCoordinates}->${toCoordinates}`
    );
  }

  gameBoardState[fromCoordinates] = false;
  gameBoardState[toCoordinates] = fromPiece;
  fromPiece.stackSize = fromPiece.stackSize + toPiece.stackSize;

  checkGameStateAndStartNextTurn(false, moveAI);
}

export function handlePassTurn() {
  const canPass =
    GameState.getCurrentTurn() === PLAYER_ONE &&
    GameState.getTurnPhase() === TURN_PHASES.STACK_OR_CAPTURE_OR_PASS;

  if (canPass) {
    GameState.nextPhase();
    hideSkipButton();
    showLoadingSpinner();
    setTimeout(moveAI);
  }
}

export function handleClickPiece(
  event:
    | React.MouseEvent<HTMLCanvasElement>
    | React.SyntheticEvent<HTMLCanvasElement>
) {
  const currentTurn = GameState.getCurrentTurn();
  const gameBoardState = GameState.getGameBoardState();
  const boardCoordinate = getBoardCoordinatesFromUserInteraction(event);

  if (!isCurrentPlayerPiece(boardCoordinate)) {
    return;
  }

  if (currentTurn === PLAYER_TWO && GameState.getIsSecondPlayerAI()) {
    return;
  }

  if (currentTurn === PLAYER_ONE && GameState.getIsFirstPlayerAI()) {
    return;
  }

  if (getWinner(gameBoardState, true, currentTurn)) {
    return;
  }

  const piece = gameBoardState[boardCoordinate];

  if (piece) {
    piece.isDragging = true;
  }

  GameState.setMovingPiece(boardCoordinate);
}

export function handleMovePiece(
  event:
    | React.MouseEvent<HTMLCanvasElement>
    | React.SyntheticEvent<HTMLCanvasElement>
) {
  const movingPiece = GameState.getMovingPiece();
  const currentTurn = GameState.getCurrentTurn();

  if (!movingPiece) {
    return;
  }

  if (currentTurn === PLAYER_TWO && GameState.getIsSecondPlayerAI()) {
    return;
  }

  if (currentTurn === PLAYER_ONE && GameState.getIsFirstPlayerAI()) {
    return;
  }

  const gamePiece = GameState.getGameBoardState()[movingPiece];

  if (!gamePiece) {
    throw new Error("gamepiece not here");
  }

  const [x, y] = getPixelCoordinatesFromUserInteraction(event);

  drawGameBoardState();

  drawGamePiece(gamePiece, x, y);
}

export function handleDropPiece(
  event:
    | React.MouseEvent<HTMLCanvasElement>
    | React.SyntheticEvent<HTMLCanvasElement>
) {
  const movingPiece = GameState.getMovingPiece();
  const gameBoardState = GameState.getGameBoardState();

  if (!movingPiece) {
    return;
  }

  const toCoordinates = getBoardCoordinatesFromUserInteraction(event);

  const piece = gameBoardState[movingPiece];

  if (piece) {
    piece.isDragging = false;
  }

  if (!gameBoardState[toCoordinates]) {
    GameState.setMovingPiece(null);
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

  if (
    isValidStack &&
    GameState.getTurnPhase() === TURN_PHASES.STACK_OR_CAPTURE_OR_PASS
  ) {
    stackPiece(movingPiece, toCoordinates);
  }

  GameState.setMovingPiece(null);
  drawGameBoardState();
}
