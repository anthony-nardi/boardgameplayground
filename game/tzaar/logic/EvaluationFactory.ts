import {
  TZAAR,
  TOTT,
  TZARRA,
  PLAYER_ONE,
  PLAYER_TWO,
  EDGE_COORDINATES_AS_MAP,
  CORNER_COORDINATES_AS_MAP,
  PLAYABLE_VERTICES,
} from "../constants";
import GameState, { GameBoardState } from "./gameState";
import { ValidCoordinate } from "../types/types";
import { getInvertedValidCaptures } from "./gameBoardHelpers";

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

  public getGameStateScore(node: any) {
    const gameState = node.gamestate;
    const winner = node.data.winner;

    // The ACTUAL current turn of the game (not the turn for this node.gamestate)
    const maximizingPlayer = GameState.getCurrentTurn();

    if (winner) {
      return winner === maximizingPlayer ? Infinity : -Infinity;
    }
    const minimizingPlayer =
      maximizingPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;

    const gameMetadata = this.getGameStateMetadata(gameState);

    const maximizingPlayerScore = this.getTotalScore(
      gameMetadata,
      maximizingPlayer
    );
    const minimizingPlayerScore = this.getTotalScore(
      gameMetadata,
      minimizingPlayer
    );

    return maximizingPlayerScore - minimizingPlayerScore;
  }

  private getTotalScore(
    gameMetadata: {
      PLAYER_ONE_TOTT_STACKS: number[];
      PLAYER_ONE_TZARRA_STACKS: number[];
      PLAYER_ONE_TZAAR_STACKS: number[];
      PLAYER_TWO_TOTT_STACKS: number[];
      PLAYER_TWO_TZARRA_STACKS: number[];
      PLAYER_TWO_TZAAR_STACKS: number[];
      player1StacksOnEdge: number[];
      player1StacksOnCorner: number[];
      player2StacksOnEdge: number[];
      player2StacksOnCorner: number[];
    },
    player: typeof PLAYER_ONE | typeof PLAYER_TWO
  ) {
    let stacksOnEdgeData;
    let stacksOnCornerData;
    let tottData;
    let tzaaraData;
    let tzaarData;

    if (player === PLAYER_ONE) {
      stacksOnEdgeData = gameMetadata.player1StacksOnEdge;
      stacksOnCornerData = gameMetadata.player1StacksOnCorner;
      tottData = gameMetadata.PLAYER_ONE_TOTT_STACKS;
      tzaaraData = gameMetadata.PLAYER_ONE_TZARRA_STACKS;
      tzaarData = gameMetadata.PLAYER_ONE_TZAAR_STACKS;
    } else {
      stacksOnEdgeData = gameMetadata.player2StacksOnEdge;
      stacksOnCornerData = gameMetadata.player2StacksOnCorner;
      tottData = gameMetadata.PLAYER_TWO_TOTT_STACKS;
      tzaaraData = gameMetadata.PLAYER_TWO_TZARRA_STACKS;
      tzaarData = gameMetadata.PLAYER_TWO_TZAAR_STACKS;
    }

    const tottTotal = tottData.length;
    const tzaaraTotal = tzaaraData.length;
    const tzaarTotal = tzaarData.length;

    let stacksOnEdgeScore = 0;
    let stacksOnCornerScore = 0;
    let tottScore = 0;
    let tzaaraScore = 0;
    let tzaarScore = 0;

    for (let i = 0; i < stacksOnEdgeData.length; i++) {
      stacksOnEdgeScore += stacksOnEdgeData[i] * this.EDGE_PENALTY;
    }

    for (let i = 0; i < stacksOnCornerData.length; i++) {
      stacksOnCornerScore += stacksOnCornerData[i] * this.CORNER_PENALTY;
    }

    for (let i = 0; i < tottTotal; i++) {
      tottScore += this.getScoreForStacks(tottTotal, tottData[i]);
    }

    for (let i = 0; i < tzaaraTotal; i++) {
      tzaaraScore += this.getScoreForStacks(tzaaraTotal, tzaaraData[i]);
    }

    for (let i = 0; i < tzaarTotal; i++) {
      tzaarScore += this.getScoreForStacks(tzaarTotal, tzaarData[i]);
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
    gameState: GameBoardState
  ) {
    return Boolean(getInvertedValidCaptures(coordinate, gameState).length);
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

  public getGameStateMetadata(gameState: GameBoardState) {
    const PLAYER_ONE_TOTT_STACKS = [];
    const PLAYER_ONE_TZARRA_STACKS = [];
    const PLAYER_ONE_TZAAR_STACKS = [];
    const PLAYER_TWO_TOTT_STACKS = [];
    const PLAYER_TWO_TZARRA_STACKS = [];
    const PLAYER_TWO_TZAAR_STACKS = [];

    const player1StacksOnEdge: number[] = [];
    const player1StacksOnCorner: number[] = [];
    const player2StacksOnEdge: number[] = [];
    const player2StacksOnCorner: number[] = [];

    for (let i = 0; i < PLAYABLE_VERTICES.length; i++) {
      const piece = gameState[PLAYABLE_VERTICES[i]];
      const isEdgePiece = EDGE_COORDINATES_AS_MAP[PLAYABLE_VERTICES[i]];
      const isCornerPiece = CORNER_COORDINATES_AS_MAP[PLAYABLE_VERTICES[i]];

      if (piece && piece.type) {
        if (piece.ownedBy === PLAYER_ONE) {
          if (piece.type === TOTT) {
            PLAYER_ONE_TOTT_STACKS.push(piece.stackSize);
          }
          if (piece.type === TZARRA) {
            PLAYER_ONE_TZARRA_STACKS.push(piece.stackSize);
          }
          if (piece.type === TZAAR) {
            PLAYER_ONE_TZAAR_STACKS.push(piece.stackSize);
          }
          if (isEdgePiece) {
            player1StacksOnEdge.push(piece.stackSize);
          }
          if (isCornerPiece) {
            player1StacksOnCorner.push(piece.stackSize);
          }
        }

        if (piece.ownedBy === PLAYER_TWO) {
          if (piece.type === TOTT) {
            PLAYER_TWO_TOTT_STACKS.push(piece.stackSize);
          }
          if (piece.type === TZARRA) {
            PLAYER_TWO_TZARRA_STACKS.push(piece.stackSize);
          }
          if (piece.type === TZAAR) {
            PLAYER_TWO_TZAAR_STACKS.push(piece.stackSize);
          }
          if (isEdgePiece) {
            player2StacksOnEdge.push(piece.stackSize);
          }
          if (isCornerPiece) {
            player2StacksOnCorner.push(piece.stackSize);
          }
        }
      }
    }

    return {
      PLAYER_ONE_TOTT_STACKS,
      PLAYER_ONE_TZARRA_STACKS,
      PLAYER_ONE_TZAAR_STACKS,
      PLAYER_TWO_TOTT_STACKS,
      PLAYER_TWO_TZARRA_STACKS,
      PLAYER_TWO_TZAAR_STACKS,
      player1StacksOnEdge,
      player1StacksOnCorner,
      player2StacksOnEdge,
      player2StacksOnCorner,
    };
  }
}
