import {
  PLAYER_TWO,
  PLAYER_ONE,
  RING_PLACEMENT,
  PLAYABLE_VERTICES,
  RING_MOVEMENT,
  MARKER,
  RING,
  REMOVE_RING,
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
  getMarkerRowsOf5,
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

  if (!isCurrentPlayerPiece(boardCoordinate)) {
    return;
  }

  if (currentTurn === PLAYER_TWO && GameState.getIsSecondPlayerAI()) {
    debugger;
    return;
  }

  if (currentTurn === PLAYER_ONE && GameState.getIsFirstPlayerAI()) {
    debugger;
    return;
  }

  const piece = gameBoardState[boardCoordinate];

  if (piece && piece.type === RING) {
    if (GameState.getCurrentTurnPhase() === REMOVE_RING) {
      const gameCopy = GameState.getBoardGameStateCopy(
        GameState.getGameBoardState()
      );
      gameCopy[boardCoordinate] = false;
      GameState.setCurrentTurn(
        GameState.getCurrentTurn() === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE
      );
      GameState.setCurrentTurnPhase(RING_MOVEMENT);
      GameState.setGameBoardState(gameCopy);
      drawGameBoardState();
      if (getWinner(gameCopy)) {
        alert(`winner is :${getWinner(gameCopy)}`);
      }
    } else {
      piece.isDragging = true;
      GameState.setMovingPiece(boardCoordinate);
    }
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

    for (let i = 0; i < piecesJumped.length; i++) {
      const jumpedPiece = gameState[piecesJumped[i]];
      if (jumpedPiece) {
        jumpedPiece.ownedBy =
          jumpedPiece.ownedBy === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
        gameState[piecesJumped[i]] = jumpedPiece;
      }
      GameState.setGameBoardState(gameState);
    }

    const rowsOf5 = getMarkerRowsOf5(GameState.getGameBoardState());

    if (rowsOf5.length) {
      // How do we remove the markers (can have more than 1 row at once)
      // for now lets just remove the first we see.... deal wiht the issue later lol
      const gameStateCopy = GameState.getBoardGameStateCopy(
        GameState.getGameBoardState()
      );

      for (let i = 0; i < 5; i++) {
        // @ts-expect-error fix
        gameStateCopy[rowsOf5[0][i]] = false;
      }
      GameState.setGameBoardState(gameStateCopy);
      GameState.setCurrentTurnPhase(REMOVE_RING);
    } else {
      GameState.setCurrentTurn(
        GameState.getCurrentTurn() === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE
      );
    }

    GameState.setMovingPiece(null);

    drawGameBoardState();
    return;
  }

  GameState.setMovingPiece(null);
  drawGameBoardState();
}
