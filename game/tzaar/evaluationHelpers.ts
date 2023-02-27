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

export function getHasAllThreePieceTypes(gameState: typeof gameBoardState) {

  const playerPieces = {
    [PLAYER_ONE]: {
      [TOTT]: false,
      [TZARRA]: false,
      [TZAAR]: false,
      uniquePieces: 0
    },
    [PLAYER_TWO]: {
      [TOTT]: false,
      [TZARRA]: false,
      [TZAAR]: false,
      uniquePieces: 0
    },
  }

  gameState.forEach((piece) => {
    if (piece) {
      const { ownedBy, type } = piece;
      // @ts-expect-error fix
      if (!playerPieces[ownedBy][type]) {
        // @ts-expect-error fix
        playerPieces[ownedBy][type] = true
        // @ts-expect-error fix
        playerPieces[ownedBy].uniquePieces++

        if (playerPieces[PLAYER_ONE].uniquePieces + playerPieces[PLAYER_TWO].uniquePieces === 6) {
          return false
        }
      }
    }
  })

  return {
    [PLAYER_ONE]: playerPieces[PLAYER_ONE].uniquePieces === 3,
    [PLAYER_TWO]: playerPieces[PLAYER_TWO].uniquePieces === 3
  }

}

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


export function getWinner(gameState: typeof gameBoardState, beforeTurnStart = false) {
  const playersHaveAllPieces = getHasAllThreePieceTypes(gameState)

  if (!playersHaveAllPieces[PLAYER_ONE]) {
    return PLAYER_TWO;
  }
  if (!playersHaveAllPieces[PLAYER_TWO]) {
    return PLAYER_ONE;
  }

  if (beforeTurnStart) {
    let gameWillContinue = false;

    getAllPlayerPieceCoordinates(
      gameState,
      currentTurn
    ).forEach((fromCoordinate) => {
      if (getValidCaptures(fromCoordinate, gameState).size) {
        gameWillContinue = true;
        return false
      }
    });
    if (!gameWillContinue) {
      return currentTurn === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
    }
  } else {

    let gameWillContinue = false;

    getAllPlayerPieceCoordinates(
      gameState,
      currentTurn
    ).forEach((fromCoordinate) => {
      if (getInvertedValidCaptures(fromCoordinate, gameState).size) {
        gameWillContinue = true
        return false
      }
    });


    if (
      !gameWillContinue
    ) {
      return currentTurn === PLAYER_ONE ? PLAYER_ONE : PLAYER_TWO;
    }
  }
}

 // Convert the board state into something a bit simpler to think about
  // (# of types of pieces, stack sizes, threatening positions, etc)
//   private buildScoringMap(gameState: typeof gameBoardState) {
//   const scoringMap = gameState.reduce(
//     (piecesByPlayer, piece, coordinate: ValidCoordinate) => {
//       if (!piece) {
//         return piecesByPlayer;
//       }

//       const { ownedBy, type, stackSize } = piece;
//       const countPath = [ownedBy, type, "count"];
//       const stacksThreatenedPath = [ownedBy, type, "stacksThreatened"];
//       const stacksGreaterThanOnePath = [
//         ownedBy,
//         type,
//         "stacksGreaterThanOne",
//       ];
//       const largestStackSizePath = [ownedBy, type, "largestStackSize"];
//       const stacksOnEdgePath = [ownedBy, type, "stacksOnEdge"];
//       const stacksOnCornerPath = [ownedBy, type, "stacksOnCorner"];
//       const stackValuePath = [ownedBy, type, "stackValue"];

//       return piecesByPlayer
//         .updateIn(countPath, addOne)
//         .updateIn(stackValuePath, (stackValue: any) => {
//           return stackValue + stackSize;
//         })
//         .updateIn(stacksThreatenedPath, (stacksThreatened: any) => {
//           const isPieceThreatened = getIsPieceThreatened(
//             coordinate,
//             gameState
//           );

//           return isPieceThreatened ? stacksThreatened + 1 : stacksThreatened;
//         })
//         .updateIn(
//           stacksGreaterThanOnePath,
//           (stacks: any) => stacks + (stackSize > 1 ? 1 : 0)
//         )
//         .updateIn(largestStackSizePath, (largestStackSize: any) =>
//           Math.max(largestStackSize, Number(stackSize))
//         )
//         .updateIn(stacksOnEdgePath, (stacksOnEdge: any) => {
//           const isStackOnEdge = // @ts-expect-error fix
//             stackSize > 1 && EDGE_COORDINATES.includes(coordinate);

//           return isStackOnEdge ? stacksOnEdge + 1 : stacksOnEdge;
//         })
//         .updateIn(stacksOnCornerPath, (stacksOnCorner: any) => {
//           const isStackOnCorner = // @ts-expect-error fix
//             stackSize > 1 && CORNER_COORDINATES.includes(coordinate);
//           return isStackOnCorner ? stacksOnCorner + 1 : stacksOnCorner;
//         });
//     },
//     new scoringMapRecord()
//   );

//   return scoringMap;
// }