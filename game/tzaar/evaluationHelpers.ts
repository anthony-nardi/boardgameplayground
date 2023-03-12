import {
  TZAAR,
  TOTT,
  TZARRA,
  PLAYER_ONE,
  PLAYER_TWO,
  PLAYABLE_VERTICES,
} from "./constants";
import GameState, { GameBoardState } from "./gameState";
import { Player } from "./types/types";
import { getAnyInvertedValidCaptures, getAnyCapture } from "./gameBoardHelpers";

export function getHasAllThreePieceTypes(gameState: GameBoardState) {
  let PLAYER_ONE_TOTT = false;
  let PLAYER_ONE_TZARRA = false;
  let PLAYER_ONE_TZAAR = false;
  let PLAYER_TWO_TOTT = false;
  let PLAYER_TWO_TZARRA = false;
  let PLAYER_TWO_TZAAR = false;

  for (let i = 0; i < PLAYABLE_VERTICES.length; i++) {
    const piece = gameState[PLAYABLE_VERTICES[i]];
    if (piece) {
      const { ownedBy, type } = piece;

      if (ownedBy === PLAYER_ONE) {
        if (type === TOTT) {
          PLAYER_ONE_TOTT = true;
        }
        if (type === TZARRA) {
          PLAYER_ONE_TZARRA = true;
        }
        if (type === TZAAR) {
          PLAYER_ONE_TZAAR = true;
        }
      } else {
        if (type === TOTT) {
          PLAYER_TWO_TOTT = true;
        }
        if (type === TZARRA) {
          PLAYER_TWO_TZARRA = true;
        }
        if (type === TZAAR) {
          PLAYER_TWO_TZAAR = true;
        }
      }

      if (
        PLAYER_ONE_TOTT &&
        PLAYER_ONE_TZARRA &&
        PLAYER_ONE_TZAAR &&
        PLAYER_TWO_TOTT &&
        PLAYER_TWO_TZARRA &&
        PLAYER_TWO_TZAAR
      ) {
        return {
          PLAYER_ONE: true,
          PLAYER_TWO: true,
        };
      }
    }
  }

  return {
    PLAYER_ONE: PLAYER_ONE_TOTT && PLAYER_ONE_TZARRA && PLAYER_ONE_TZAAR,
    PLAYER_TWO: PLAYER_TWO_TOTT && PLAYER_TWO_TZARRA && PLAYER_TWO_TZAAR,
  };
}

export function isAnyPieceCapturable(
  gameState: GameBoardState,
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

export function canCaptureAnyPiece(gameState: GameBoardState, player: Player) {
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

export function getWinner(
  gameState: GameBoardState,
  beforeTurnStart: boolean,
  turn: Player
) {
  const playersHaveAllPieces = getHasAllThreePieceTypes(gameState);

  if (!playersHaveAllPieces[PLAYER_ONE]) {
    return PLAYER_TWO;
  }
  if (!playersHaveAllPieces[PLAYER_TWO]) {
    return PLAYER_ONE;
  }

  if (beforeTurnStart) {
    const gameWillContinue = canCaptureAnyPiece(gameState, turn);

    if (!gameWillContinue) {
      return turn === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
    }
  } else {
    const gameWillContinue = isAnyPieceCapturable(gameState, turn);

    if (!gameWillContinue) {
      return turn === PLAYER_ONE ? PLAYER_ONE : PLAYER_TWO;
    }
  }
}
