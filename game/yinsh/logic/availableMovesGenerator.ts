import {
  TZAAR,
  TOTT,
  TZARRA,
  PLAYER_ONE,
  PLAYER_TWO,
  PLAYABLE_VERTICES,
} from "../constants";
import GameState, { GameBoardState } from "./GameState";
import { Player, PlayerPieces, ValidCoordinate } from "../types/types";

export function getGameStatesToAnalyze(
  gameState: GameBoardState,
  turn: Player
) {}

export function getAllPlayerPieceCoordinates(
  gameState: GameBoardState,
  player: Player
) {
  let coordinates: ValidCoordinate[] = [];

  for (let i = 0; i < PLAYABLE_VERTICES.length; i++) {
    const coordinate = PLAYABLE_VERTICES[i];
    const piece = gameState[coordinate];
    if (piece && piece.ownedBy === player) {
      coordinates.push(coordinate);
    }
  }

  return coordinates;
}

export function getAllPlayerPieceCoordinatesByType(
  gameState: GameBoardState,
  player: Player,
  type: PlayerPieces,
  stackSize: number = 1
) {
  let coordinates: ValidCoordinate[] = [];

  for (let i = 0; i < PLAYABLE_VERTICES.length; i++) {
    const coordinate = PLAYABLE_VERTICES[i];
    const piece = gameState[coordinate];
    if (piece && piece.ownedBy === player && piece.type === type) {
      coordinates.push(coordinate);
    }
  }

  return coordinates;
}

export function getPossibleMoveSequences(
  gameState: GameBoardState,
  turn: Player
) {
  return [];
}
