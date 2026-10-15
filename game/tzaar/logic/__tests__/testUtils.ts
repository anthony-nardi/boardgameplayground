import { PLAYABLE_VERTICES } from "../../constants";
import { Player, PlayerPieces, ValidCoordinate } from "../../types/types";
import { GameBoardState, PieceState } from "../GameState";

/** A board where every playable vertex is empty. */
export function emptyBoard(): GameBoardState {
  const board = {} as GameBoardState;
  for (const coordinate of PLAYABLE_VERTICES) {
    board[coordinate] = false;
  }
  return board;
}

export function piece(
  ownedBy: Player,
  type: PlayerPieces,
  stackSize = 1
): PieceState {
  return { ownedBy, type, stackSize, isDragging: false };
}

/** Build a board from a sparse description of pieces. */
export function boardWith(
  pieces: Partial<Record<ValidCoordinate, PieceState>>
): GameBoardState {
  const board = emptyBoard();
  for (const [coordinate, pieceState] of Object.entries(pieces)) {
    board[coordinate as ValidCoordinate] = pieceState as PieceState;
  }
  return board;
}

export function countPieces(
  board: GameBoardState,
  predicate: (p: PieceState) => boolean
) {
  let count = 0;
  for (const coordinate of PLAYABLE_VERTICES) {
    const p = board[coordinate];
    if (p && predicate(p)) {
      count++;
    }
  }
  return count;
}
