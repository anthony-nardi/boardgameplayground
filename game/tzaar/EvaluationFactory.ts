import { RecordOf } from "immutable";
import {
  TZAAR,
  TOTT,
  TZARRA,
  PLAYER_ONE,
  PLAYER_TWO,
  CORNER_COORDINATES,
  EDGE_COORDINATES,
} from "./constants";
import { gameBoardState, currentTurn } from "./gameState";
import { Player, PlayerPieces, ValidCoordinate } from "./types/types";
import { getInvertedValidCaptures, getValidCaptures } from "./gameBoardHelpers";
import {
  scoringMapRecord,
  PieceRecordProps,
  ScoringMapProps,
} from "./scoringMap";
import { getWinner } from "./evaluationHelpers";

export default class EvaluationFactory {
  constructor(props: {
    EDGE_PENALTY: number;
    CORNER_PENALTY: number;
    LARGEST_STACK_BONUS: number;
    STACK_VALUE_BONUS: number;
    VERSION: number
    STACK_SIZE_SCORE_MULTIPLIER: number,
    COUNT_SCORE_MULTIPLIER: number,
    STACK_VALUE_BONUS_MULTIPLIER: number
    SCORE_FOR_STACKS_THREATENED_MULTIPLIER: number
  }) {
    this.EDGE_PENALTY = props.EDGE_PENALTY;
    this.CORNER_PENALTY = props.CORNER_PENALTY;
    this.LARGEST_STACK_BONUS = props.LARGEST_STACK_BONUS;
    this.STACK_VALUE_BONUS = props.STACK_VALUE_BONUS;
    this.VERSION = props.VERSION
    this.STACK_SIZE_SCORE_MULTIPLIER = props.STACK_SIZE_SCORE_MULTIPLIER
    this.COUNT_SCORE_MULTIPLIER = props.COUNT_SCORE_MULTIPLIER
    this.SCORE_FOR_STACKS_THREATENED_MULTIPLIER = props.SCORE_FOR_STACKS_THREATENED_MULTIPLIER
    this.STACK_VALUE_BONUS_MULTIPLIER = props.STACK_VALUE_BONUS_MULTIPLIER
  }

  EDGE_PENALTY: number;
  CORNER_PENALTY: number;
  LARGEST_STACK_BONUS: number;
  STACK_VALUE_BONUS: number;
  STACK_SIZE_SCORE_MULTIPLIER: number;
  COUNT_SCORE_MULTIPLIER: number
  STACK_VALUE_BONUS_MULTIPLIER: number
  SCORE_FOR_STACKS_THREATENED_MULTIPLIER: number
  VERSION: number

  public getGameStateScore(
    gameState: typeof gameBoardState,
    playerToMaximize: typeof PLAYER_ONE | typeof PLAYER_TWO,
    debug = true
  ) {
    const winner = getWinner(gameState);

    if (winner) {
      return winner !== playerToMaximize ? -Infinity : Infinity;
    }

    const scoringMap = this.buildScoringMap(gameState);

    if (debug) {
      console.log(scoringMap.toJS());
    }

    let score = 0;




    const playerOneTOTTScore = this.getPlayersScore(
      TOTT,
      PLAYER_ONE,
      scoringMap,
      debug
    );
    const playerOneTZARRAScore = this.getPlayersScore(
      TZARRA,
      PLAYER_ONE,
      scoringMap,
      debug
    );
    const playerOneTZAARScore = this.getPlayersScore(
      TZAAR,
      PLAYER_ONE,
      scoringMap,
      debug
    );
    const playerTwoTOTTScore = this.getPlayersScore(
      TOTT,
      PLAYER_TWO,
      scoringMap,
      debug
    );
    const playerTwoTZARRAScore = this.getPlayersScore(
      TZARRA,
      PLAYER_TWO,
      scoringMap,
      debug
    );
    const playerTwoTZAARScore = this.getPlayersScore(
      TZAAR,
      PLAYER_TWO,
      scoringMap,
      debug
    );

    const playerOneTotalScore =
      playerOneTOTTScore + playerOneTZARRAScore + playerOneTZAARScore;
    const playerTwoTotalScore =
      playerTwoTOTTScore + playerTwoTZARRAScore + playerTwoTZAARScore;

    if (playerToMaximize === PLAYER_ONE) {
      score = playerOneTotalScore - playerTwoTotalScore;
    } else {
      score = playerTwoTotalScore - playerOneTotalScore;
    }

    if (debug) {
      console.log(
        `Total score for maximizing player: ${playerToMaximize === PLAYER_ONE
          ? playerOneTotalScore
          : playerTwoTotalScore
        }`
      );
      console.log(
        `Total score for minimizing player: ${playerToMaximize === PLAYER_ONE
          ? playerTwoTotalScore
          : playerOneTotalScore
        }`
      );
      console.log(`Score for game state: ${score}`);
    }

    return score;
  }

  private getPlayersScore(
    pieceType: PlayerPieces,
    player: Player,
    scoringMap: RecordOf<ScoringMapProps>,
    debug = true
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
      stacks
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

    const scoreForHighestStack = this.getScoreForHighestStack(
      largestStackSize,
      opponentsLargestStackSize
    );
    const scoreForStacksThreatened = this.getScoreForStacksThreatened(
      stacksThreatened,
      pieceType
    ) * this.SCORE_FOR_STACKS_THREATENED_MULTIPLIER
    const scoreForEdgesAndCorners = this.getScoreForEdgesAndCorners(
      stacksOnEdge,
      stacksOnCorner
    );
    const scoreForPieceMaterialPower = this.getScoreForMaterialPower(
      stackValue,
      count
    );

    const scoreForStacks = this.getScoreForStacks(count, stackValue) * this.STACK_VALUE_BONUS_MULTIPLIER
    const countScore = this.getCountScore(count) * this.COUNT_SCORE_MULTIPLIER
    const stackSizeScore = this.getStacksScore(stacks) * this.STACK_SIZE_SCORE_MULTIPLIER

    const materialScore = countScore * stackSizeScore

    let scoreForPlayer =
      scoreForHighestStack +
      scoreForStacksThreatened +
      // scoreForPieceMaterialPower
      scoreForStacks +
      materialScore

    debugger

    if (countScore) {
      console.log(`
      ${player} score breakdown for ${pieceType}:
      materialScore: ${materialScore}
      scoreForHighestStack ${scoreForHighestStack}
      scoreForStacksThreatened ${scoreForStacksThreatened}
      scoreForEdgedAndCorners ${scoreForEdgesAndCorners}
      totalScore:  ${scoreForPlayer}
    `);
    }

    return scoreForPlayer;
  }


  // we value stacks depending on how many of that type are on the board
  private getScoreForStacks(numberOfPieces: number, stackSize: number) {
    return (this.STACK_VALUE_BONUS - numberOfPieces) * stackSize;
  }

  private getScoreForStacksThreatened(
    stacksThreatened: number,
    pieceType: typeof TZAAR | typeof TZARRA | typeof TOTT
  ) {
    return stacksThreatened
  }

  private getScoreForMaterialPower(stackSize: number, count: number) {
    const countPower = 100 / count;

    if (stackSize > 1 && stackSize < 5) {
      return 30 * countPower;
    }
    if (stackSize >= 5) {
      return 15 * countPower;
    }
    return stackSize * countPower;
  }

  private getIsPieceThreatened(
    coordinate: ValidCoordinate,
    gameState: typeof gameBoardState
  ) {
    return Boolean(getInvertedValidCaptures(coordinate, gameState).size);
  }

  private getScoreForEdgesAndCorners(edges: number, corners: number) {
    return edges * this.EDGE_PENALTY + corners * this.CORNER_PENALTY;
  }

  private getScoreForHighestStack(currentStack: number, stackToBeat: number) {
    return currentStack > stackToBeat ? this.LARGEST_STACK_BONUS : 0;
  }

  private addOne(n: any) {
    return n + 1;
  }

  private getStacksScore(stacks: number[]) {
    return stacks.reduce((total, stack) => {
      return total + this.getStackSizeScore(stack)
    }, 0)
  }

  private getStackSizeScore(stackSize: number) {

    if (this.VERSION === 1) {
      return 0
    }
    if (this.VERSION === 2) {

      if (stackSize <= 4) {
        return Math.pow(stackSize, 3)
      } else {
        return 64 - Math.pow((stackSize - 4), 2)
      }
    }

    return 0
  }

  private getCountScore(count: number) {
    if (this.VERSION === 1) {
      return 0
    }
    if (this.VERSION === 2) {
      if (count === 1) {
        return 100
      }
      if (count > 5) {
        return 20
      }
      return 100 / (count + 1)
    }

    return 0
  }


  // Convert the board state into something a bit simpler to think about
  // (# of types of pieces, stack sizes, threatening positions, etc)
  private buildScoringMap(gameState: typeof gameBoardState) {
    const scoringMap = gameState.reduce(
      (piecesByPlayer, piece, coordinate: ValidCoordinate) => {
        if (!piece) {
          return piecesByPlayer;
        }

        const { ownedBy, type, stackSize } = piece;
        const countPath = [ownedBy, type, "count"];
        const stacksThreatenedPath = [ownedBy, type, "stacksThreatened"];
        const stacksGreaterThanOnePath = [
          ownedBy,
          type,
          "stacksGreaterThanOne",
        ];
        const largestStackSizePath = [ownedBy, type, "largestStackSize"];
        const stacksOnEdgePath = [ownedBy, type, "stacksOnEdge"];
        const stacksOnCornerPath = [ownedBy, type, "stacksOnCorner"];
        const stackValuePath = [ownedBy, type, "stackValue"];
        const stacksPath = [ownedBy, type, 'stacks']

        return piecesByPlayer
          .updateIn(countPath, this.addOne)
          .updateIn(stackValuePath, (stackValue: any) => {
            return stackValue + stackSize;
          })
          .updateIn(stacksPath, (stacks: any) => {
            return stacks.concat([stackSize])
          })
          .updateIn(stacksThreatenedPath, (stacksThreatened: any) => {

            if (stackSize > 1) {
              const isPieceThreatened = this.getIsPieceThreatened(
                coordinate,
                gameState
              );
              return isPieceThreatened ? stackSize + stacksThreatened : stacksThreatened
            }
            return stacksThreatened

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
}
