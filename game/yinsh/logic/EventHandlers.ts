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
import GameState, { PieceState } from "./GameState";
import React from "react";
import { Player, ValidCoordinate } from "../types/types";
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
import { moveAI } from "./gameLogic";

function isCurrentPlayerPiece(boardCoordinate: ValidCoordinate) {
  const piece = GameState.getGameBoardState()[boardCoordinate];

  return piece && piece.ownedBy === GameState.getCurrentTurn();
}

function handleRingPlacementClick(boardCoordinate: ValidCoordinate) {
  const currentTurn = GameState.getCurrentTurn();
  const gameBoardState = GameState.getGameBoardState();

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
  } else {
    if (
      GameState.getCurrentTurn() === PLAYER_TWO &&
      GameState.getIsSecondPlayerAI()
    ) {
      moveAI();
    }
    if (
      GameState.getCurrentTurn() === PLAYER_ONE &&
      GameState.getIsFirstPlayerAI()
    ) {
      moveAI();
    }
  }
  drawGameBoardState();
  return;
}

function isInvalidClick(boardCoordinate: ValidCoordinate) {
  const currentTurn = GameState.getCurrentTurn();

  if (currentTurn === PLAYER_TWO && GameState.getIsSecondPlayerAI()) {
    return true;
  }
  if (currentTurn === PLAYER_ONE && GameState.getIsFirstPlayerAI()) {
    return true;
  }
  // Allow us to remove an opponents ring if there are two human players.
  if (GameState.getCurrentTurnPhase() === REMOVE_RING) {
    return false;
  }

  if (!isCurrentPlayerPiece(boardCoordinate)) {
    return true;
  }

  return false;
}

function handleClickRing(piece: PieceState, boardCoordinate: ValidCoordinate) {
  if (GameState.getCurrentTurnPhase() === REMOVE_RING) {
    // The owner of the markers removed is the owner of the ring to remove.
    if (piece.ownedBy !== GameState.getPlayerRingToRemove()) {
      return;
    }

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

export function handleClickPiece(
  event:
    | React.MouseEvent<HTMLCanvasElement>
    | React.SyntheticEvent<HTMLCanvasElement>
) {
  const gameBoardState = GameState.getGameBoardState();
  const boardCoordinate = getBoardCoordinatesFromUserInteraction(event);
  const phase = GameState.getPhase();

  if (phase === RING_PLACEMENT) {
    handleRingPlacementClick(boardCoordinate);
    return;
  }

  if (isInvalidClick(boardCoordinate)) {
    return;
  }

  const piece = gameBoardState[boardCoordinate];

  if (piece && piece.type === RING) {
    handleClickRing(piece, boardCoordinate);
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

      // @ts-expect-error fix
      const playersRingToRemove = gameStateCopy[rowsOf5[0][0]]
        .ownedBy as Player;

      for (let i = 0; i < 5; i++) {
        // @ts-expect-error fix
        gameStateCopy[rowsOf5[0][i]] = false;
      }

      GameState.setGameBoardState(gameStateCopy);
      GameState.setCurrentTurnPhase(REMOVE_RING);
      GameState.setPlayerRingToRemove(playersRingToRemove);
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
