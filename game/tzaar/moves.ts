import { List, Map } from "immutable";
import {
  TZAAR,
  TOTT,
  TZARRA,
  PLAYER_ONE,
  PLAYER_TWO,
  PLAYABLE_VERTICES,
} from "./constants";
import { gameBoardState, numberOfTurnsIntoGame } from "./gameState";
import {
  getValidCaptures,
  getValidStacks,
  getInvertedValidCaptures,
  getValidStacksAndCaptures,
} from "./gameBoardHelpers";
import {
  PieceType,
  Player,
  PlayerPieces,
  ValidCoordinate,
} from "./types/types";

export function getGameStatesToAnalyze(
  gameState: typeof gameBoardState,
  turn: Player,
  getAllPossibleMoves?: boolean
) {
  const EARLY_GAME = numberOfTurnsIntoGame < 10;

  if (!EARLY_GAME || getAllPossibleMoves) {
    return getPossibleMoveSequences(gameState, turn);
  } else if (numberOfTurnsIntoGame === 0) {
    return getFirstTurnMoveSequence(gameState, turn);
  } else {
    let moves = getEarlyGameMoveSequences(gameState, turn, TZAAR);
    console.log(
      `EARLY GAME: ${moves.length} possible moves selected for TZAAR pieces.`
    );

    if (!moves.length) {
      moves = getEarlyGameMoveSequences(gameState, turn, TZARRA);
      console.log(
        `EARLY GAME: ${moves.length} possible moves selected for TZARRA pieces.`
      );
    }

    if (!moves.length) {
      moves = getEarlyGameMoveSequences(gameState, turn, TOTT);
      console.log(
        `EARLY GAME: ${moves.length} possible moves selected for TOTT pieces.`
      );
    }

    return moves;
  }
}

function getFirstTurnMoveSequence(gameState: any, turn: Player) {
  const moves: string[] = [];

  const playerPiecesToCapture = turn === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
  const allOpponentPlayerPieces = getAllPlayerPieceCoordinatesByType(
    gameState,
    playerPiecesToCapture,
    TZAAR
  );

  // If opponent has any stacks > 1 it is worth attempting to capture...
  // need to specifically look at the stacks to see if they can be captured.

  // If opponent has <= 2 pieces of a type we need to see if we can capture both.

  // Never pass

  // Always stack unless above conditions are satisfied

  for (
    let opponentCoordinateIndex = 0;
    opponentCoordinateIndex < allOpponentPlayerPieces.length;
    opponentCoordinateIndex++
  ) {
    const toCoordinate = allOpponentPlayerPieces[opponentCoordinateIndex];
    const captureCoordinates = getInvertedValidCaptures(
      toCoordinate,
      gameState
    );

    for (
      let captureCoordinateIndex = 0;
      captureCoordinateIndex < captureCoordinates.length;
      captureCoordinateIndex++
    ) {
      const fromCoordinate = captureCoordinates[captureCoordinateIndex];
      const sequenceKey = fromCoordinate + "->" + toCoordinate;
      moves.push(sequenceKey);
    }
  }

  return moves;
}

export function getEarlyGameMoveSequences(
  gameState: any,
  turn: Player,
  type: PlayerPieces
) {
  const moves: string[] = [];

  const playerPiecesToCapture = turn === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;

  // Get all of the opponents most valuable pieces
  const allOpponentPlayerPieces = getAllPlayerPieceCoordinatesByType(
    gameState,
    playerPiecesToCapture,
    type
  );

  // If opponent has any stacks > 1 it is worth attempting to capture...
  // need to specifically look at the stacks to see if they can be captured.

  // If opponent has <= 2 pieces of a type we need to see if we can capture both.

  // Never pass

  // Always stack unless above conditions are satisfied

  // For every valuable opponent piece, get the move required to capture those pieces.
  // From there we can figure out our next move (stack or capture valuable pieces).
  for (
    let opponentCoordinateIndex = 0;
    opponentCoordinateIndex < allOpponentPlayerPieces.length;
    opponentCoordinateIndex++
  ) {
    const toCoordinate = allOpponentPlayerPieces[opponentCoordinateIndex];
    const captureCoordinates = getInvertedValidCaptures(
      toCoordinate,
      gameState
    );

    for (
      let captureCoordinateIndex = 0;
      captureCoordinateIndex < captureCoordinates.length;
      captureCoordinateIndex++
    ) {
      const fromCoordinate = captureCoordinates[captureCoordinateIndex];
      const sequenceKey = fromCoordinate + "->" + toCoordinate;

      const currentPieceOnFromCoordinate = gameState[fromCoordinate];
      const currentPieceOnToCoordinate = gameState[toCoordinate];

      gameState[fromCoordinate] = null;
      gameState[toCoordinate] = currentPieceOnFromCoordinate;

      // for the piece we just moved... lets find ITS moves... (this is optimization so it looks dumb)
      // if its not obvious, only 2 coordinates on the board changed so we can reuse most of the previous results from getAllPlayerPieceCoordinates
      const validMovesForPieceJustMoved = getValidStacksAndCaptures(
        toCoordinate,
        gameState
      );

      for (
        let validMoveIndex = 0;
        validMoveIndex < validMovesForPieceJustMoved.length;
        validMoveIndex++
      ) {
        const moveString =
          sequenceKey +
          "=>" +
          toCoordinate +
          "->" +
          validMovesForPieceJustMoved[validMoveIndex];
        moves.push(moveString);
      }

      const allOpponentPlayerPiecesWithHighStacks =
        getAllPlayerPieceCoordinatesByType(
          gameState,
          playerPiecesToCapture,
          type,
          2
        );

      for (
        let highStackIndex = 0;
        highStackIndex < allOpponentPlayerPiecesWithHighStacks.length;
        highStackIndex++
      ) {
        const toCoordinate =
          allOpponentPlayerPiecesWithHighStacks[highStackIndex];
        const captureCoordinates = getInvertedValidCaptures(
          toCoordinate,
          gameState
        );

        for (
          let captureCoordinateIndex = 0;
          captureCoordinateIndex < captureCoordinates.length;
          captureCoordinateIndex++
        ) {
          const fromCoordinate = captureCoordinates[captureCoordinateIndex];
          const secondCaptureMoveSequence =
            fromCoordinate + "->" + toCoordinate;
          const moveString = sequenceKey + "=>" + secondCaptureMoveSequence;
          moves.push(moveString);
        }
      }

      const allPlayerPiecesOfType = getAllPlayerPieceCoordinatesByType(
        gameState,
        turn,
        type
      );
      // TODO: Really we should stack our most valuable pieces or try to capture the opponent high stacks...
      for (let j = 0; j < allPlayerPiecesOfType.length; j++) {
        const playerPieceCoordinateAfterCapture = allPlayerPiecesOfType[j];
        const validMoves = getValidStacks(
          playerPieceCoordinateAfterCapture,
          gameState
        );

        for (
          let validMoveIndex = 0;
          validMoveIndex < validMoves.length;
          validMoveIndex++
        ) {
          const moveString =
            sequenceKey +
            "=>" +
            playerPieceCoordinateAfterCapture +
            "->" +
            validMoves[validMoveIndex];

          moves.push(moveString);
        }
      }

      // rollback state
      gameState[fromCoordinate] = currentPieceOnFromCoordinate;
      gameState[toCoordinate] = currentPieceOnToCoordinate;
    }
  }

  return moves;
}

export function getAllPlayerPieceCoordinates(
  gameState: typeof gameBoardState,
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
  gameState: typeof gameBoardState,
  player: Player,
  type: PlayerPieces,
  stackSize: number = 1
) {
  let coordinates: ValidCoordinate[] = [];

  for (let i = 0; i < PLAYABLE_VERTICES.length; i++) {
    const coordinate = PLAYABLE_VERTICES[i];
    const piece = gameState[coordinate];
    if (
      piece &&
      piece.ownedBy === player &&
      piece.type === type &&
      piece.stackSize >= stackSize
    ) {
      coordinates.push(coordinate);
    }
  }

  return coordinates;
}

export function getPossibleMoveSequences(
  gameState: typeof gameBoardState,
  turn: Player
) {
  const moves: string[] = [];
  const playerCoordinates = getAllPlayerPieceCoordinates(gameState, turn);

  for (
    let playerCoordinateIndex = 0;
    playerCoordinateIndex < playerCoordinates.length;
    playerCoordinateIndex++
  ) {
    const fromCoordinate = playerCoordinates[playerCoordinateIndex];

    const captureCoordinates = getValidCaptures(fromCoordinate, gameState);

    for (
      let captureCoordinateIndex = 0;
      captureCoordinateIndex < captureCoordinates.length;
      captureCoordinateIndex++
    ) {
      const coordinateToCapture = captureCoordinates[captureCoordinateIndex];

      const currentPieceOnFromCoordinate = gameState[fromCoordinate];
      const currentPieceOnToCoordinate = gameState[coordinateToCapture];

      const fromToKey = fromCoordinate + "->" + coordinateToCapture;

      // apply state
      // @ts-expect-error fix
      gameState[fromCoordinate] = null;
      gameState[coordinateToCapture] = currentPieceOnFromCoordinate;

      // for the piece we just moved... lets find ITS moves... (this is optimization so it looks dumb)
      // if its not obvious, only 2 coordinates on the board changed so we can reuse most of the previous results from getAllPlayerPieceCoordinates
      const validMovesForPieceJustMoved = getValidStacksAndCaptures(
        coordinateToCapture,
        gameState
      );

      for (
        let validMoveIndex = 0;
        validMoveIndex < validMovesForPieceJustMoved.length;
        validMoveIndex++
      ) {
        const moveString =
          fromToKey +
          "=>" +
          coordinateToCapture +
          "->" +
          validMovesForPieceJustMoved[validMoveIndex];
        moves.push(moveString);
      }

      for (let j = 0; j < playerCoordinates.length; j++) {
        const playerPieceCoordinateAfterCapture = playerCoordinates[j];

        // This is where we moved from...
        if (playerPieceCoordinateAfterCapture === fromCoordinate) {
          continue;
        }

        const validMoves = getValidStacksAndCaptures(
          playerPieceCoordinateAfterCapture,
          gameState
        );

        for (
          let validMoveIndex = 0;
          validMoveIndex < validMoves.length;
          validMoveIndex++
        ) {
          const moveString =
            fromToKey +
            "=>" +
            playerPieceCoordinateAfterCapture +
            "->" +
            validMoves[validMoveIndex];

          moves.push(moveString);
        }

        // We can just capture, then pass
        moves.push(fromToKey);
      }

      // rollback state
      gameState[fromCoordinate] = currentPieceOnFromCoordinate;
      gameState[coordinateToCapture] = currentPieceOnToCoordinate;
    }
  }

  return moves;
}
