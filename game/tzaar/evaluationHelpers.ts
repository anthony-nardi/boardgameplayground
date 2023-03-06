import { List, Map, RecordOf } from "immutable";
import {
  TZAAR,
  TOTT,
  TZARRA,
  PLAYER_ONE,
  PLAYER_TWO,
  PLAYABLE_VERTICES,
} from "./constants";
import { gameBoardState, currentTurn } from "./gameState";
import { PieceType, Player } from "./types/types";
import {
  getInvertedValidCaptures,
  getValidCaptures,
  getAnyInvertedValidCaptures,
  getAnyCapture,
} from "./gameBoardHelpers";

export function getHasAllThreePieceTypes(gameState: typeof gameBoardState) {
  const playerPieces = {
    [PLAYER_ONE]: {
      [TOTT]: false,
      [TZARRA]: false,
      [TZAAR]: false,
      uniquePieces: 0,
    },
    [PLAYER_TWO]: {
      [TOTT]: false,
      [TZARRA]: false,
      [TZAAR]: false,
      uniquePieces: 0,
    },
  };

  for (let i = 0; i < PLAYABLE_VERTICES.length; i++) {
    const piece = gameState[PLAYABLE_VERTICES[i]];
    if (piece) {
      const { ownedBy, type } = piece;
      // @ts-expect-error fix
      if (!playerPieces[ownedBy][type]) {
        // @ts-expect-error fix
        playerPieces[ownedBy][type] = true;
        // @ts-expect-error fix
        playerPieces[ownedBy].uniquePieces++;

        if (
          playerPieces[PLAYER_ONE].uniquePieces +
            playerPieces[PLAYER_TWO].uniquePieces ===
          6
        ) {
          return {
            [PLAYER_ONE]: playerPieces[PLAYER_ONE].uniquePieces === 3,
            [PLAYER_TWO]: playerPieces[PLAYER_TWO].uniquePieces === 3,
          };
        }
      }
    }
  }

  return {
    [PLAYER_ONE]: playerPieces[PLAYER_ONE].uniquePieces === 3,
    [PLAYER_TWO]: playerPieces[PLAYER_TWO].uniquePieces === 3,
  };
}

export function getAllPlayerPieceCoordinates(
  gameState: typeof gameBoardState,
  player: Player
) {
  let coordinates = [];

  for (let i = 0; i < PLAYABLE_VERTICES.length; i++) {
    const coordinate = PLAYABLE_VERTICES[i];
    const piece = gameState[coordinate];
    if (piece && piece.ownedBy === player) {
      coordinates.push(coordinate);
    }
  }

  return coordinates;
}

export function isAnyPieceCapturable(
  gameState: typeof gameBoardState,
  player: Player
) {
  for (let i = 0; i < PLAYABLE_VERTICES.length; i++) {
    const coordinate = PLAYABLE_VERTICES[i];
    const piece = gameState[coordinate];
    if (
      piece &&
      piece.ownedBy === player &&
      getAnyInvertedValidCaptures(coordinate, gameState)
    ) {
      return true;
    }
  }
  return false;
}

export function canCaptureAnyPiece(
  gameState: typeof gameBoardState,
  player: Player
) {
  for (let i = 0; i < PLAYABLE_VERTICES.length; i++) {
    const coordinate = PLAYABLE_VERTICES[i];
    const piece = gameState[coordinate];
    if (
      piece &&
      piece.ownedBy === player &&
      getAnyCapture(coordinate, gameState)
    ) {
      return true;
    }
  }

  return false;
}

export function getAllPlayerPieceCoordinatesByType(
  gameState: typeof gameBoardState,
  player: Player,
  type: PieceType
) {
  let coordinates = [];

  for (let i = 0; i < PLAYABLE_VERTICES.length; i++) {
    const coordinate = PLAYABLE_VERTICES[i];
    const piece = gameState[coordinate];
    if (piece && piece.ownedBy === player && piece.type === type) {
      coordinates.push(coordinate);
    }
  }

  return coordinates;
}

export function getWinner(
  gameState: typeof gameBoardState,
  beforeTurnStart = false
) {
  const playersHaveAllPieces = getHasAllThreePieceTypes(gameState);

  if (!playersHaveAllPieces[PLAYER_ONE]) {
    return PLAYER_TWO;
  }
  if (!playersHaveAllPieces[PLAYER_TWO]) {
    return PLAYER_ONE;
  }

  if (beforeTurnStart) {
    const gameWillContinue = canCaptureAnyPiece(gameState, currentTurn);

    if (!gameWillContinue) {
      return currentTurn === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
    }
  } else {
    const gameWillContinue = isAnyPieceCapturable(gameState, currentTurn);

    if (!gameWillContinue) {
      return currentTurn === PLAYER_ONE ? PLAYER_ONE : PLAYER_TWO;
    }
  }
}
