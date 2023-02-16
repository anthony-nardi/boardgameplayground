import { List, Map, RecordOf } from "immutable";
import {
  TZAAR,
  TOTT,
  TZARRA,
  PLAYER_ONE,
  PLAYER_TWO,
  CORNER_COORDINATES,
  EDGE_COORDINATES,
  GamePieceRecordProps,
} from "./constants";
import { gameBoardState, currentTurn, turnPhase } from "./gameState";
import { PieceType, Player, ValidCoordinate } from "./types/types";
import { getInvertedValidCaptures, getValidCaptures } from "./gameBoardHelpers";
import { scoringMapRecord } from "./scoringMap";

export function getPieces(gameState: typeof gameBoardState) {
  return gameState.reduce(
    (piecesByPlayer, piece) => {
      if (!piece) {
        return piecesByPlayer;
      }
      const { ownedBy, type } = piece;
      return piecesByPlayer.updateIn([ownedBy, type], (pieces: any) =>
        pieces.push(piece)
      );
    },
    Map({
      [PLAYER_ONE]: Map({
        [TOTT]: List<RecordOf<GamePieceRecordProps>>(),
        [TZARRA]: List<RecordOf<GamePieceRecordProps>>(),
        [TZAAR]: List<RecordOf<GamePieceRecordProps>>(),
      }),
      [PLAYER_TWO]: Map({
        [TOTT]: List<RecordOf<GamePieceRecordProps>>(),
        [TZARRA]: List<RecordOf<GamePieceRecordProps>>(),
        [TZAAR]: List<RecordOf<GamePieceRecordProps>>(),
      }),
    })
  );
}


export function getAllPlayerPieceCoordinates(
  gameState: typeof gameBoardState,
  player: Player
) {
  return gameState
    .filter((piece) => piece && piece.ownedBy === player)
    .keySeq();
}

export function getAllPlayerPieceCoordinatesByType(
  gameState: typeof gameBoardState,
  player: Player,
  type: PieceType
) {
  return gameState
    .filter((piece) => piece && piece.ownedBy === player && piece.type === type)
    .keySeq();
}