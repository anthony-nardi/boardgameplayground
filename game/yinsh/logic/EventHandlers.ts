import {
  PLAYER_TWO,
  PLAYER_ONE,
  RING_PLACEMENT,
  PLAYABLE_VERTICES,
  RING_MOVEMENT,
} from "../constants";
import { drawGameBoardState, drawGamePiece } from "../rendering/renderHelpers";
import GameState from "./GameState";
import React from "react";
import { ValidCoordinate } from "../types/types";
import {
  getPixelCoordinatesFromUserInteraction,
  getBoardCoordinatesFromUserInteraction,
} from "../rendering/coordinateHelpers";
import { getWinner } from "./evaluationHelpers";
import { isValidEmptyCoordinate } from "./gameBoardHelpers";

function isCurrentPlayerPiece(boardCoordinate: ValidCoordinate) {
  const piece = GameState.getGameBoardState()[boardCoordinate];
  return piece && piece.ownedBy === GameState.getCurrentTurn();
}

export function handleClickPiece(
  event:
    | React.MouseEvent<HTMLCanvasElement>
    | React.SyntheticEvent<HTMLCanvasElement>
) {
  const currentTurn = GameState.getCurrentTurn();
  const gameBoardState = GameState.getGameBoardState();
  const boardCoordinate = getBoardCoordinatesFromUserInteraction(event);
  const phase = GameState.getPhase();

  if (phase === RING_PLACEMENT) {
    if (!isValidEmptyCoordinate(boardCoordinate, gameBoardState)) {
      return;
    }

    if (currentTurn === PLAYER_ONE) {
      GameState.setPlayerOneRing(boardCoordinate);
      GameState.setCurrentTurn(PLAYER_TWO);
    } else {
      GameState.setPlayerTwoRing(boardCoordinate);
      GameState.setCurrentTurn(PLAYER_ONE);
    }

    if (
      GameState.getPlayerOneRingsPlaced() +
        GameState.getPlayerTwoRingsPlaced() ===
      10
    ) {
      GameState.setPhase(RING_MOVEMENT);
    }
    drawGameBoardState();
  }

  console.log(boardCoordinate);

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

  GameState.setMovingPiece(null);
  drawGameBoardState();
}
