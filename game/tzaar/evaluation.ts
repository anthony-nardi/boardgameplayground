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

// Pieces on the edge and corner have less mobility
const EDGE_PENALTY = -5;
const CORNER_PENALTY = -10;

function getIsPieceThreatened(
  coordinate: ValidCoordinate,
  gameState: typeof gameBoardState
) {
  return Boolean(getInvertedValidCaptures(coordinate, gameState).size);
}

function getScoreForEdgesAndCorners(edges: number, corners: number) {
  return edges * EDGE_PENALTY + corners * CORNER_PENALTY;
}
function getScoreForHighestStack(currentStack: number, stackToBeat: number) {
  if (currentStack > stackToBeat) {
    return 20;
  }

  if (currentStack < stackToBeat) {
    return -20;
  }

  return 0;
}

function addOne(n: any) {
  return n + 1;
}

// Convert the board state into something a bit simpler to think about
// (# of types of pieces, stack sizes, threatening positions, etc)
function buildScoringMap(gameState: typeof gameBoardState) {
  const scoringMap = gameState.reduce(
    (piecesByPlayer, piece, coordinate: ValidCoordinate) => {
      if (!piece) {
        return piecesByPlayer;
      }

      const { ownedBy, type, stackSize } = piece;
      const countPath = [ownedBy, type, "count"];
      const stacksThreatenedPath = [ownedBy, type, "stacksThreatened"];
      const stacksGreaterThanOnePath = [ownedBy, type, "stacksGreaterThanOne"];
      const largestStackSizePath = [ownedBy, type, "largestStackSize"];
      const stacksOnEdgePath = [ownedBy, type, "stacksOnEdge"];
      const stacksOnCornerPath = [ownedBy, type, "stacksOnCorner"];

      return piecesByPlayer
        .updateIn(countPath, addOne)
        .updateIn(stacksThreatenedPath, (stacksThreatened: any) => {
          const isPieceThreatened = getIsPieceThreatened(coordinate, gameState);

          return isPieceThreatened ? stacksThreatened + 1 : stacksThreatened;
        })
        .updateIn(
          stacksGreaterThanOnePath,
          (stacks: any) => stacks + (stackSize > 1 ? 1 : 0)
        )
        .updateIn(largestStackSizePath, (largestStackSize: any) =>
          Math.max(largestStackSize, Number(stackSize))
        )
        .updateIn(stacksOnEdgePath, (stacksOnEdge: any) => {
          const isStackOnEdge = // @ts-expect-error fix
            stackSize > 1 && EDGE_COORDINATES.includes(coordinate);

          return isStackOnEdge ? stacksOnEdge + 1 : stacksOnEdge;
        })
        .updateIn(stacksOnCornerPath, (stacksOnCorner: any) => {
          const isStackOnCorner = // @ts-expect-error fix
            stackSize > 1 && CORNER_COORDINATES.includes(coordinate);
          return isStackOnCorner ? stacksOnCorner + 1 : stacksOnCorner;
        });
    },
    new scoringMapRecord()
  );

  return scoringMap;
}

export function getGameStateScore(
  gameState: typeof gameBoardState,
  debug: boolean
) {
  const winner = getWinner(gameState);

  if (winner === PLAYER_ONE) {
    return -Infinity;
  }

  if (winner === PLAYER_TWO) {
    return Infinity;
  }

  if (debug) {
    debugger;
  }

  const scoringMap = buildScoringMap(gameState);

  if (debug) {
    console.log(scoringMap.toJS());
  }

  let score = 0;
  // @ts-expect-error fix
  scoringMap
    .get(PLAYER_ONE)
    // @ts-expect-error fix

    .forEach((data, pieceType: typeof TZAAR | typeof TZARRA | typeof TOTT) => {
      const scoreForStacks = // @ts-expect-error fix
        getScoreForStacks(data.get("count"), data.get("stacksGreaterThanOne"));
      const scoreForHighestStack = getScoreForHighestStack(
        // @ts-expect-error fix
        data.get("largestStackSize"),
        scoringMap.getIn([PLAYER_TWO, pieceType, "largestStackSize"])
      );
      // @ts-expect-error fix
      const scoreForStacksThreatened = getScoreForStacksThreatened(
        data.get("stacksThreatened"),
        pieceType
      );
      const scoreForEdgesAndCorners = getScoreForEdgesAndCorners(
        // @ts-expect-error fix
        data.get("stacksOnEdge"),
        data.get("stacksOnCorner")
      );

      const scoreForPlayerOne =
        -scoreForStacks -
        scoreForHighestStack +
        scoreForStacksThreatened +
        scoreForEdgesAndCorners;

      if (debug) {
        console.log(`
          Player 1 score breakdown for ${pieceType}:
          scoreForStacks -${scoreForStacks}
          scoreForHighestStack -${scoreForHighestStack}
          scoreForStacksThreatened +${scoreForStacksThreatened}
          scoreForEdgedAndCorners +${scoreForEdgesAndCorners}
          totalScore:  ${scoreForPlayerOne}
        `);
      }

      score = score + scoreForPlayerOne;
    });
  // @ts-expect-error fix
  scoringMap
    .get(PLAYER_TWO)
    // @ts-expect-error fix

    .forEach((data, pieceType: typeof TZAAR | typeof TZARRA | typeof TOTT) => {
      const scoreForStacks = // @ts-expect-error fix
        getScoreForStacks(data.get("count"), data.get("stacksGreaterThanOne"));
      const scoreForHighestStack = getScoreForHighestStack(
        // @ts-expect-error fix
        data.get("largestStackSize"),
        scoringMap.getIn([PLAYER_TWO, pieceType, "largestStackSize"])
      );
      // @ts-expect-error fix
      const scoreForStacksThreatened = getScoreForStacksThreatened(
        data.get("stacksThreatened"),
        pieceType
      );
      const scoreForEdgesAndCorners = getScoreForEdgesAndCorners(
        // @ts-expect-error fix
        data.get("stacksOnEdge"),
        data.get("stacksOnCorner")
      );

      const scoreForPlayerTwo =
        scoreForStacks +
        scoreForHighestStack -
        scoreForStacksThreatened -
        scoreForEdgesAndCorners;

      if (debug) {
        console.log(`
          Player 2 score breakdown for ${pieceType}:
          scoreForStacks +${scoreForStacks}
          scoreForHighestStack +${scoreForHighestStack}
          scoreForStacksThreatened -${scoreForStacksThreatened}
          scoreForEdgedAndCorners -${scoreForEdgesAndCorners}
          totalScore: ${scoreForPlayerTwo}
        `);
      }
      score = score + scoreForPlayerTwo;
    });

  return score;
}

function getScoreForStacksThreatened(
  stacksThreatened: number,
  pieceType: typeof TZAAR | typeof TZARRA | typeof TOTT
) {
  if (pieceType === TZAAR) {
    return 200 * stacksThreatened;
  }
  if (pieceType === TZARRA) {
    return 100 * stacksThreatened;
  }
  if (pieceType === TOTT) {
    return 1 * stacksThreatened;
  }
}

// we value stacks depending on how many of that type are on the board
function getScoreForStacks(numberOfPieces: number, stackSize: number) {
  const MULTIPLIER = 15;

  return (MULTIPLIER - numberOfPieces) * stackSize;
}

function getPieces(gameState: typeof gameBoardState) {
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

export function getWinner(
  gameState: typeof gameBoardState,
  beforeTurnStart = false
) {
  const pieceCountsByPlayer = getPieces(gameState);

  const playerOneLost =
    // @ts-expect-error fix
    !pieceCountsByPlayer.getIn([PLAYER_ONE, TOTT]).size ||
    // @ts-expect-error fix
    !pieceCountsByPlayer.getIn([PLAYER_ONE, TZARRA]).size ||
    // @ts-expect-error fix
    !pieceCountsByPlayer.getIn([PLAYER_ONE, TZAAR]).size;

  const playerTwoLost =
    // @ts-expect-error fix
    !pieceCountsByPlayer.getIn([PLAYER_TWO, TOTT]).size ||
    // @ts-expect-error fix
    !pieceCountsByPlayer.getIn([PLAYER_TWO, TZARRA]).size ||
    // @ts-expect-error fix
    !pieceCountsByPlayer.getIn([PLAYER_TWO, TZAAR]).size;

  if (playerOneLost) {
    return PLAYER_TWO;
  }
  if (playerTwoLost) {
    return PLAYER_ONE;
  }

  if (beforeTurnStart) {
    // TODO: Dont think we need this as it was incorrect all along!
    const possibleCaptures = getAllPlayerPieceCoordinates(
      gameState, // @ts-expect-error fix
      currentTurn
    ).map((fromCoordinate) => {
      return getValidCaptures(fromCoordinate, gameState);
    });
    // @ts-expect-error fix
    if (!possibleCaptures.find((possibleCapture) => possibleCapture.size)) {
      return currentTurn === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
    }
  } else {
    const invertedCaptures = getAllPlayerPieceCoordinates(
      gameState, // @ts-expect-error fix
      currentTurn
    ).map((fromCoordinate) => {
      return getInvertedValidCaptures(fromCoordinate, gameState);
    });

    if (
      !invertedCaptures.find((possibleCapture) => Boolean(possibleCapture.size))
    ) {
      return currentTurn === PLAYER_ONE ? PLAYER_ONE : PLAYER_TWO;
    }
  }
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
