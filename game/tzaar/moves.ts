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
import { Player, PlayerPieces, ValidCoordinate } from "./types/types";

export function getGameStatesToAnalyze(
  gameState: typeof gameBoardState,
  turn: Player,
  firstTurnOfGame?: boolean
) {
  const EARLY_GAME = numberOfTurnsIntoGame < 3;

  let allPossibleStatesAfterTurn = {};

  if (!EARLY_GAME) {
    allPossibleStatesAfterTurn = getPossibleMoveSequences(gameState, turn);
  } else {
    allPossibleStatesAfterTurn = {
      ...getEarlyGamePossibleMoveSequences(
        gameState,
        TZAAR,
        turn,
        firstTurnOfGame
      ),
      ...getEarlyGamePossibleMoveSequences(
        gameState,
        TZARRA,
        turn,
        firstTurnOfGame
      ),
      ...getEarlyGamePossibleMoveSequences(
        gameState,
        TOTT,
        turn,
        firstTurnOfGame
      ),
    };
  }

  return allPossibleStatesAfterTurn;
}

export function getAllPlayerPieceCoordinates(
  gameState: typeof gameBoardState,
  player: Player
) {
  let coordinates = [];

  for (let i = 0; i < PLAYABLE_VERTICES.length; i++) {
    const coordinate = PLAYABLE_VERTICES[i];
    const piece = gameState[coordinate];
    if (piece && piece.ownedBy === player) {
      coordinates.push(coordinate);
    }
  }

  return coordinates as ValidCoordinate[];
}

export function getAllPlayerPieceCoordinatesByType(
  gameState: typeof gameBoardState,
  player: Player,
  type: PlayerPieces
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

function getEarlyGamePossibleMoveSequences(
  gameState: typeof gameBoardState,
  PIECE_TYPE: PlayerPieces,
  turn: Player,
  firstTurnOfGame?: Boolean
) {
  const playerPiecesToCapture = turn === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
  let trySecondCapture = false;

  // get opponents most valuable pieces to capture.
  const allOpponentPlayerPieces = getAllPlayerPieceCoordinatesByType(
    gameState,
    playerPiecesToCapture,
    PIECE_TYPE
  );

  if (allOpponentPlayerPieces.length <= 2) {
    trySecondCapture = true;
  }

  let allGameStatesAfterMoveSeq: { [key: string]: any } = {};

  for (let i = 0; i < allOpponentPlayerPieces.length; i++) {
    const toCoordinate = allOpponentPlayerPieces[i];
    const validCaptures = getInvertedValidCaptures(toCoordinate, gameState);
    // For every piece, get all possible captures
    // for each and put the resulting game state into a list.
    const allCaptureStates: { [key: string]: any } = {};

    for (let k = 0; k < validCaptures.length; k++) {
      const fromCoordinate = validCaptures[k];
      const fromPiece = Object.assign({}, gameState[fromCoordinate]);
      const nextGameState = Object.assign({}, gameState);
      nextGameState[fromCoordinate] = null;
      nextGameState[toCoordinate] = fromPiece;
      allCaptureStates[`${fromCoordinate}->${toCoordinate}`] = nextGameState;
    }

    if (firstTurnOfGame) {
      return Object.keys(allCaptureStates);
      // allCaptureStates.forEach((stateAfterCapture, fromToKey) => {
      //   // @ts-expect-error fix
      //   allGameStatesAfterMoveSeq[fromToKey] = stateAfterCapture;
      // });
    }
    if (!firstTurnOfGame) {
      allCaptureStates.forEach((stateAfterCapture: any, fromToKey: string) => {
        if (trySecondCapture) {
          const allOpponentPlayerPieces = getAllPlayerPieceCoordinatesByType(
            stateAfterCapture,
            playerPiecesToCapture,
            PIECE_TYPE
          );
          allOpponentPlayerPieces.forEach((toCoordinate) => {
            const validCaptures = getInvertedValidCaptures(
              toCoordinate,
              stateAfterCapture
            );

            validCaptures.forEach((fromCoordinate) => {
              const fromPiece = stateAfterCapture.get(fromCoordinate);
              const sequenceKey = `${fromToKey}=>${fromCoordinate}->${toCoordinate}`;
              const gameStateAfterSecondCapture = Object.assign(
                {},
                stateAfterCapture
              );
              gameStateAfterSecondCapture[fromCoordinate] = null;
              gameStateAfterSecondCapture[toCoordinate] = fromPiece;

              allGameStatesAfterMoveSeq[sequenceKey] =
                gameStateAfterSecondCapture;
            });
          });
        }

        let allPlayerPiecesAfterCapture = getAllPlayerPieceCoordinatesByType(
          stateAfterCapture,
          turn,
          TZAAR
        );

        if (!allPlayerPiecesAfterCapture.length) {
          allPlayerPiecesAfterCapture = getAllPlayerPieceCoordinatesByType(
            stateAfterCapture,
            turn,
            TZARRA
          );
        }
        if (!allPlayerPiecesAfterCapture.length) {
          allPlayerPiecesAfterCapture = getAllPlayerPieceCoordinatesByType(
            stateAfterCapture,
            turn,
            TOTT
          );
        }
        if (!allPlayerPiecesAfterCapture.length) {
          alert("This shouldnt be possible, let me know if you see this.");
        }

        allPlayerPiecesAfterCapture.forEach(
          (playerPieceCoordinateAfterCapture) => {
            const validStacks = getValidStacks(
              playerPieceCoordinateAfterCapture,
              stateAfterCapture
            );
            const fromPiece =
              stateAfterCapture[playerPieceCoordinateAfterCapture];

            validStacks.forEach((toCoordinate) => {
              const toPiece = stateAfterCapture[toCoordinate];
              const gameStateAfterMoveSeq = Object.assign(
                {},
                stateAfterCapture
              );
              gameStateAfterMoveSeq[playerPieceCoordinateAfterCapture] = null;
              gameStateAfterMoveSeq[toCoordinate] = Object.assign(
                {},
                fromPiece
              );
              gameStateAfterMoveSeq[toCoordinate].stackSize =
                fromPiece.stackSize + toPiece.stackSize;

              const sequenceKey = `${fromToKey}=>${playerPieceCoordinateAfterCapture}->${toCoordinate}`;
              allGameStatesAfterMoveSeq[sequenceKey] = gameStateAfterMoveSeq;
            });
          }
        );
      });
    }
  }

  return allGameStatesAfterMoveSeq;
}

function getAllCaptureStates(
  fromCoordinate: ValidCoordinate,
  gameState: typeof gameBoardState
) {
  const validCaptures = getValidCaptures(fromCoordinate, gameState);

  // For every piece, get all possible captures
  // for each and put the resulting game state into a list.
  const allCaptureStates = [];

  for (let k = 0; k < validCaptures.length; k++) {
    const toCoordinate = validCaptures[k];
    const fromPiece = gameState[fromCoordinate];

    const stateToApply = [
      { coordinate: fromCoordinate, state: null },
      { coordinate: toCoordinate, state: fromPiece },
    ];
    allCaptureStates.push(stateToApply);
  }

  return allCaptureStates;
}

export function getPossibleMoveSequences(
  gameState: typeof gameBoardState,
  turn: Player
) {
  const moves: { [key: string]: any } = {};
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

      const fromToKey = fromCoordinate + "->" + coordinateToCapture; //`${fromCoordinate}->${coordinateToCapture}`;

      // apply state
      gameState[fromCoordinate] = null;
      gameState[coordinateToCapture] = currentPieceOnFromCoordinate;

      const allPlayerPiecesAfterFirstCapture = getAllPlayerPieceCoordinates(
        gameState,
        turn
      );

      for (let j = 0; j < allPlayerPiecesAfterFirstCapture.length; j++) {
        const playerPieceCoordinateAfterCapture =
          allPlayerPiecesAfterFirstCapture[j];
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
          moves[moveString] = null;
        }

        // We can just capture, then pass
        moves[fromToKey] = null;
      }

      // rollback state
      gameState[fromCoordinate] = currentPieceOnFromCoordinate;
      gameState[coordinateToCapture] = currentPieceOnToCoordinate;
    }
  }

  return moves;
}
