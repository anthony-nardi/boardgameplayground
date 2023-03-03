import {
  TZAAR,
  TOTT,
  TZARRA,
  PLAYER_ONE,
  PLAYER_TWO,
  CORNER_COORDINATES,
  EDGE_COORDINATES,
  EDGE_COORDINATES_AS_MAP,
  CORNER_COORDINATES_AS_MAP,
  PLAYABLE_VERTICES
} from "./constants";
import { gameBoardState } from "./gameState";
import { Player, PlayerPieces, ValidCoordinate } from "./types/types";
import { getInvertedValidCaptures, getValidCaptures } from "./gameBoardHelpers";
import { getWinner } from "./evaluationHelpers";

export default class EvaluationFactory {
  constructor(props: {
    CORNER_PENALTY_MULTIPLIER: number;
    COUNT_SCORE_MULTIPLIER: number;
    EDGE_PENALTY_MULTIPLIER: number;
    LARGEST_STACK_BONUS_MULTIPLIER: number;
    SCORE_FOR_STACKS_THREATENED_MULTIPLIER: number;
    STACK_SIZE_SCORE_MULTIPLIER: number;
    STACK_VALUE_BONUS_MULTIPLIER: number;
    VERSION: number;
  }) {
    this.VERSION = props.VERSION;
    this.CORNER_PENALTY_MULTIPLIER = props.CORNER_PENALTY_MULTIPLIER;
    this.EDGE_PENALTY_MULTIPLIER = props.EDGE_PENALTY_MULTIPLIER;
    this.LARGEST_STACK_BONUS_MULTIPLIER = props.LARGEST_STACK_BONUS_MULTIPLIER;
    this.STACK_SIZE_SCORE_MULTIPLIER = props.STACK_SIZE_SCORE_MULTIPLIER;
    this.COUNT_SCORE_MULTIPLIER = props.COUNT_SCORE_MULTIPLIER;
    this.SCORE_FOR_STACKS_THREATENED_MULTIPLIER =
      props.SCORE_FOR_STACKS_THREATENED_MULTIPLIER;
    this.STACK_VALUE_BONUS_MULTIPLIER = props.STACK_VALUE_BONUS_MULTIPLIER;
  }

  CORNER_PENALTY_MULTIPLIER: number;
  COUNT_SCORE_MULTIPLIER: number;
  EDGE_PENALTY_MULTIPLIER: number;
  LARGEST_STACK_BONUS_MULTIPLIER: number;
  SCORE_FOR_STACKS_THREATENED_MULTIPLIER: number;
  STACK_SIZE_SCORE_MULTIPLIER: number;
  STACK_VALUE_BONUS_MULTIPLIER: number;
  VERSION: number;

  STACK_VALUE_BONUS = 15;
  EDGE_PENALTY = -1;
  CORNER_PENALTY = -2;
  LARGEST_STACK_BONUS = 1;

  public getGameStateScore(
    gameState: typeof gameBoardState,
    playerToMaximize: typeof PLAYER_ONE | typeof PLAYER_TWO,
    winner?: Player,
    debug = true
  ) {

    if (winner) {
      return winner !== playerToMaximize ? -Infinity : Infinity;
    }

    const gameMetadata = this.getGameStateMetadata(gameState);
    let score = 0;

    const playerOneTotalScore = this.getTotalScore(gameMetadata, PLAYER_ONE);
    const playerTwoTotalScore = this.getTotalScore(gameMetadata, PLAYER_TWO);

    if (playerToMaximize === PLAYER_ONE) {
      score = playerOneTotalScore - playerTwoTotalScore;
    } else {
      score = playerTwoTotalScore - playerOneTotalScore;
    }

    // if (debug) {
    //   console.log(
    //     `Total score for maximizing player: ${playerToMaximize === PLAYER_ONE
    //       ? playerOneTotalScore
    //       : playerTwoTotalScore
    //     }`
    //   );
    //   console.log(
    //     `Total score for minimizing player: ${playerToMaximize === PLAYER_ONE
    //       ? playerTwoTotalScore
    //       : playerOneTotalScore
    //     }`
    //   );
    //   console.log(`Score for game state: ${score}`);
    // }

    return score;
  }

  private getTotalScore(
    gameMetadata: {
      player1Stacks: {
        TOTT: number[];
        TZARRA: number[];
        TZAAR: number[];
      };
      player2Stacks: {
        TOTT: number[];
        TZARRA: number[];
        TZAAR: number[];
      };
      player1StacksOnEdge: number[];
      player1StacksOnCorner: number[];
      player2StacksOnEdge: number[];
      player2StacksOnCorner: number[];
    },
    player: typeof PLAYER_ONE | typeof PLAYER_TWO
  ) {
    const key = player === PLAYER_ONE ? "player1Stacks" : "player2Stacks";
    const stacksOnEdgeData = gameMetadata[`${key}OnEdge`]
    const stacksOnCornerData = gameMetadata[`${key}OnCorner`]
    const tottData = gameMetadata[key].TOTT
    const tzaaraData = gameMetadata[key].TZARRA
    const tzaarData = gameMetadata[key].TZAAR

    const tottTotal = tottData.length;
    const tzaaraTotal = tzaaraData.length;
    const tzaarTotal = tzaarData.length

    let stacksOnEdgeScore = 0;
    let stacksOnCornerScore = 0;
    let tottScore = 0;
    let tzaaraScore = 0;
    let tzaarScore = 0;


    for (let i = 0; i < stacksOnEdgeData.length; i++) {
      stacksOnEdgeScore += stacksOnEdgeData[i] * this.EDGE_PENALTY
    }

    for (let i = 0; i < stacksOnCornerData.length; i++) {
      stacksOnCornerScore += stacksOnCornerData[i] * this.CORNER_PENALTY
    }

    for (let i = 0; i < tottTotal; i++) {
      tottScore += this.getScoreForStacks(tottTotal, tottData[i])
    }

    for (let i = 0; i < tzaaraTotal; i++) {
      tzaaraScore += this.getScoreForStacks(tzaaraTotal, tzaaraData[i])
    }

    for (let i = 0; i < tzaarTotal; i++) {
      tzaarScore += this.getScoreForStacks(tzaarTotal, tzaarData[i])
    }

    stacksOnEdgeScore = stacksOnEdgeScore * this.EDGE_PENALTY_MULTIPLIER;
    stacksOnCornerScore = stacksOnCornerScore * this.CORNER_PENALTY_MULTIPLIER;
    tottScore = tottScore * this.STACK_VALUE_BONUS_MULTIPLIER;
    tzaaraScore = tzaaraScore * this.STACK_VALUE_BONUS_MULTIPLIER;
    tzaarScore = tzaarScore * this.STACK_VALUE_BONUS_MULTIPLIER;

    return (
      stacksOnEdgeScore +
      stacksOnCornerScore +
      tottScore +
      tzaaraScore +
      tzaarScore
    );
  }

  // private getPlayersScore(
  //   pieceType: PlayerPieces,
  //   player: Player,
  //   scoringMap: RecordOf<ScoringMapProps>,
  //   debug = true
  // ) {
  //   const pieceMetadata: RecordOf<PieceRecordProps> =
  //     scoringMap[player][pieceType];
  //   const {
  //     count,
  //     largestStackSize,
  //     stacksThreatened,
  //     stacksOnEdge,
  //     stacksOnCorner,
  //     stackValue,
  //     stacks,
  //   } = pieceMetadata;

  //   const otherPlayer = player === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;

  //   const otherPlayerPieces = scoringMap[otherPlayer];
  //   const otherPlayerTOTTs = otherPlayerPieces.TOTT;
  //   const otherPlayerTZARRAs = otherPlayerPieces.TZARRA;
  //   const otherPlayerTZAARs = otherPlayerPieces.TZAAR;

  //   const opponentsLargestStackSize = Math.max(
  //     otherPlayerTOTTs.largestStackSize,
  //     otherPlayerTZARRAs.largestStackSize,
  //     otherPlayerTZAARs.largestStackSize
  //   );

  //   const scoreForHighestStack = this.getScoreForHighestStack(
  //     largestStackSize,
  //     opponentsLargestStackSize
  //   );
  //   const scoreForStacksThreatened =
  //     this.getScoreForStacksThreatened(stacksThreatened, pieceType) *
  //     this.SCORE_FOR_STACKS_THREATENED_MULTIPLIER;
  //   const scoreForEdgesAndCorners = this.getScoreForEdgesAndCorners(
  //     stacksOnEdge,
  //     stacksOnCorner
  //   );
  //   const scoreForPieceMaterialPower = this.getScoreForMaterialPower(
  //     stackValue,
  //     count
  //   );

  //   const scoreForStacks =
  //     this.getScoreForStacks(count, stackValue) *
  //     this.STACK_VALUE_BONUS_MULTIPLIER;
  //   const countScore = this.getCountScore(count) * this.COUNT_SCORE_MULTIPLIER;
  //   const stackSizeScore =
  //     this.getStacksScore(stacks) * this.STACK_SIZE_SCORE_MULTIPLIER;

  //   const materialScore = countScore * stackSizeScore;

  //   let scoreForPlayer =
  //     scoreForHighestStack +
  //     scoreForStacksThreatened +
  //     // scoreForPieceMaterialPower
  //     scoreForStacks +
  //     materialScore;

  //   debugger;

  //   if (countScore) {
  //     console.log(`
  //     ${player} score breakdown for ${pieceType}:
  //     materialScore: ${materialScore}
  //     scoreForHighestStack ${scoreForHighestStack}
  //     scoreForStacksThreatened ${scoreForStacksThreatened}
  //     scoreForEdgedAndCorners ${scoreForEdgesAndCorners}
  //     totalScore:  ${scoreForPlayer}
  //   `);
  //   }

  //   return scoreForPlayer;
  // }

  // we value stacks depending on how many of that type are on the board
  private getScoreForStacks(numberOfPieces: number, stackSize: number) {
    return (this.STACK_VALUE_BONUS - numberOfPieces) * stackSize;
  }

  private getScoreForStacksThreatened(
    stacksThreatened: number,
    pieceType: typeof TZAAR | typeof TZARRA | typeof TOTT
  ) {
    return stacksThreatened;
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
      return total + this.getStackSizeScore(stack);
    }, 0);
  }

  private getStackSizeScore(stackSize: number) {
    if (this.VERSION === 1) {
      return 0;
    }
    if (this.VERSION === 2) {
      if (stackSize <= 4) {
        return Math.pow(stackSize, 3);
      } else {
        return 64 - Math.pow(stackSize - 4, 2);
      }
    }

    return 0;
  }

  private getCountScore(count: number) {
    if (this.VERSION === 1) {
      return 0;
    }
    if (this.VERSION === 2) {
      if (count === 1) {
        return 100;
      }
      if (count > 5) {
        return 20;
      }
      return 100 / (count + 1);
    }

    return 0;
  }

  private getGameStateMetadata(gameState: typeof gameBoardState) {
    const player1Stacks = {
      [TOTT]: [] as number[],
      [TZARRA]: [] as number[],
      [TZAAR]: [] as number[],
    };
    const player2Stacks = {
      [TOTT]: [] as number[],
      [TZARRA]: [] as number[],
      [TZAAR]: [] as number[],
    };
    const player1StacksOnEdge: number[] = [];
    const player1StacksOnCorner: number[] = [];
    const player2StacksOnEdge: number[] = [];
    const player2StacksOnCorner: number[] = [];

    for (let i = 0; i < PLAYABLE_VERTICES.length; i++) {
      const coordinate = PLAYABLE_VERTICES[i]
      const piece = gameState[coordinate]

      if (piece && piece.type) {
        const { ownedBy, type, stackSize } = piece;
        const isEdgePiece = EDGE_COORDINATES_AS_MAP[coordinate];
        const isCornerPiece = CORNER_COORDINATES_AS_MAP[coordinate];


        if (ownedBy === PLAYER_ONE) {
          player1Stacks[type].push(stackSize);
          if (isEdgePiece) {
            player1StacksOnEdge.push(stackSize);
          }
          if (isCornerPiece) {
            player1StacksOnCorner.push(stackSize);
          }
        }

        if (ownedBy === PLAYER_TWO) {
          player2Stacks[type].push(stackSize);
          if (isEdgePiece) {
            player2StacksOnEdge.push(stackSize);
          }
          if (isCornerPiece) {
            player2StacksOnCorner.push(stackSize);
          }
        }
      }
    }



    return {
      player1Stacks,
      player2Stacks,
      player1StacksOnEdge,
      player1StacksOnCorner,
      player2StacksOnEdge,
      player2StacksOnCorner,
    };
  }
}
