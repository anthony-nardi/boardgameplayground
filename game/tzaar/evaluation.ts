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
import {
  PieceType,
  Player,
  PlayerPieces,
  ValidCoordinate,
} from "./types/types";
import { getInvertedValidCaptures, getValidCaptures } from "./gameBoardHelpers";
import {
  scoringMapRecord,
  PieceRecordProps,
  ScoringMapProps,
} from "./scoringMap";
import {
  getPieces,
  getAllPlayerPieceCoordinates,
  getAllPlayerPieceCoordinatesByType,
} from "./evaluationHelpers";

// Pieces on the edge and corner have less mobility
const EDGE_PENALTY = -5;
const CORNER_PENALTY = -10;
// Whoever has the largest stack gets bonus points
const LARGEST_STACK_BONUS = 50;

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
  return currentStack > stackToBeat ? LARGEST_STACK_BONUS : 0;
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
      const stackValuePath = [ownedBy, type, "stackValue"];

      return piecesByPlayer
        .updateIn(countPath, addOne)
        .updateIn(stackValuePath, (stackValue: any) => {
          return stackValue + stackSize;
        })
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

  if (winner) {
    return winner === PLAYER_ONE ? -Infinity : Infinity;
  }

  const scoringMap = buildScoringMap(gameState);

  if (debug) {
    console.log(scoringMap.toJS());
  }

  let score = 0;

  const playerOneTOTTScore = getPlayersScore(
    TOTT,
    PLAYER_ONE,
    scoringMap,
    debug
  );
  const playerOneTZARRAScore = getPlayersScore(
    TZARRA,
    PLAYER_ONE,
    scoringMap,
    debug
  );
  const playerOneTZAARScore = getPlayersScore(
    TZAAR,
    PLAYER_ONE,
    scoringMap,
    debug
  );
  const playerTwoTOTTScore = getPlayersScore(
    TOTT,
    PLAYER_TWO,
    scoringMap,
    debug
  );
  const playerTwoTZARRAScore = getPlayersScore(
    TZARRA,
    PLAYER_TWO,
    scoringMap,
    debug
  );
  const playerTwoTZAARScore = getPlayersScore(
    TZAAR,
    PLAYER_TWO,
    scoringMap,
    debug
  );

  const playerOneTotalScore =
    playerOneTOTTScore + playerOneTZARRAScore + playerOneTZAARScore;
  const playerTwoTotalScore =
    playerTwoTOTTScore + playerTwoTZARRAScore + playerTwoTZAARScore;

  score = playerTwoTotalScore - playerOneTotalScore;

  if (debug) {
    console.log(`Total score for player one: ${playerOneTotalScore}`);
    console.log(`Total score for player two: ${playerTwoTotalScore}`);
    console.log(`Score for game state: ${score}`);
  }

  return score;
}

function getPlayersScore(
  pieceType: PlayerPieces,
  player: Player,
  scoringMap: RecordOf<ScoringMapProps>,
  debug: Boolean
) {
  const pieceMetadata: RecordOf<PieceRecordProps> =
    scoringMap[player][pieceType];
  const {
    count,
    largestStackSize,
    stacksThreatened,
    stacksOnEdge,
    stacksOnCorner,
    stackValue,
  } = pieceMetadata;

  const otherPlayer = player === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;

  const otherPlayerPieces = scoringMap[otherPlayer];
  const otherPlayerTOTTs = otherPlayerPieces.TOTT;
  const otherPlayerTZARRAs = otherPlayerPieces.TZARRA;
  const otherPlayerTZAARs = otherPlayerPieces.TZAAR;

  const opponentsLargestStackSize = Math.max(
    otherPlayerTOTTs.largestStackSize,
    otherPlayerTZARRAs.largestStackSize,
    otherPlayerTZAARs.largestStackSize
  );

  const scoreForHighestStack = getScoreForHighestStack(
    largestStackSize,
    opponentsLargestStackSize
  );
  const scoreForStacksThreatened = getScoreForStacksThreatened(
    stacksThreatened,
    pieceType
  );
  const scoreForEdgesAndCorners = getScoreForEdgesAndCorners(
    stacksOnEdge,
    stacksOnCorner
  );
  const scoreForPieceMaterialPower = getScoreForMaterialPower(
    stackValue,
    count
  );

  const scoreForPlayer =
    scoreForHighestStack +
    scoreForStacksThreatened +
    scoreForEdgesAndCorners +
    scoreForPieceMaterialPower;

  if (debug) {
    console.log(`
      ${player} score breakdown for ${pieceType}:
      scoreForHighestStack ${scoreForHighestStack}
      scoreForStacksThreatened ${scoreForStacksThreatened}
      scoreForEdgedAndCorners ${scoreForEdgesAndCorners}
      scoreForPieceMaterialPower: ${scoreForPieceMaterialPower}
      totalScore:  ${scoreForPlayer}
    `);
  }

  return scoreForPlayer;
}

function getScoreForStacksThreatened(
  stacksThreatened: number,
  pieceType: typeof TZAAR | typeof TZARRA | typeof TOTT
) {
  if (pieceType === TZAAR) {
    return 10 * stacksThreatened;
  }
  if (pieceType === TZARRA) {
    return 10 * stacksThreatened;
  }
  if (pieceType === TOTT) {
    return 1 * stacksThreatened;
  }
  return 0;
}

function getScoreForMaterialPower(stackSize: number, count: number) {
  const countPower = 100 / count;

  if (stackSize > 1 && stackSize < 5) {
    return 30 * countPower;
  }
  if (stackSize >= 5) {
    return 15 * countPower;
  }
  return stackSize * countPower;
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
      gameState,
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
      gameState,
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
