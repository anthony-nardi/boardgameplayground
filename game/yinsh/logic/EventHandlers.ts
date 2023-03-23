import {
  PLAYER_TWO,
  PLAYER_ONE,
  RING_PLACEMENT,
  PLAYABLE_VERTICES,
  RING_MOVEMENT,
  MARKER,
  RING,
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
import {
  getJumpedPieces,
  getValidRingMoves,
  isValidEmptyCoordinate,
} from "./gameBoardHelpers";

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
  console.log(boardCoordinate);
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
    return;
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

  // if (getWinner(gameBoardState, true, currentTurn)) {
  //   return;
  // }

  const piece = gameBoardState[boardCoordinate];

  if (piece && piece.type === RING) {
    piece.isDragging = true;
    GameState.setMovingPiece(boardCoordinate);
  }
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

  const validRingMovements = getValidRingMoves(movingPiece, gameBoardState);

  if (validRingMovements.includes(toCoordinates)) {
    GameState.setCoordinateValue(toCoordinates, piece);
    GameState.setCoordinateValue(movingPiece, {
      type: MARKER,
      // @ts-expect-error fix
      ownedBy: piece.ownedBy,
      isDragging: false,
    });
    const gameState = GameState.getBoardGameStateCopy(
      GameState.getGameBoardState()
    );
    const piecesJumped = getJumpedPieces(movingPiece, toCoordinates, gameState);
    console.log(piecesJumped);

    for (let i = 0; i < piecesJumped.length; i++) {
      const jumpedPiece = gameState[piecesJumped[i]];
      if (jumpedPiece) {
        jumpedPiece.ownedBy =
          jumpedPiece.ownedBy === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
        gameState[piecesJumped[i]] = jumpedPiece;
      }
      GameState.setGameBoardState(gameState);
    }
    // remove jumped pieces if all the same color. Then remove a ring
    if (piecesJumped.length >= 5) {
    }

    GameState.setMovingPiece(null);

    drawGameBoardState();
    return;
  }

  GameState.setMovingPiece(null);
  drawGameBoardState();
}
