import { List, Map } from "immutable";
import { TZAAR, TOTT, TZARRA, PLAYER_ONE, PLAYER_TWO, PLAYABLE_VERTICES } from "./constants";
import { gameBoardState, numberOfTurnsIntoGame } from "./gameState";
import {
  getValidCaptures,
  getValidStacks,
  getInvertedValidCaptures,
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
      ), ...getEarlyGamePossibleMoveSequences(
        gameState,
        TZARRA,
        turn,
        firstTurnOfGame
      ), ...getEarlyGamePossibleMoveSequences(
        gameState,
        TOTT,
        turn,
        firstTurnOfGame
      )
    }
  }

  return allPossibleStatesAfterTurn;
}

export function getAllPlayerPieceCoordinates(
  gameState: typeof gameBoardState,
  player: Player
) {

  let coordinates = []

  for (let i = 0; i < PLAYABLE_VERTICES.length; i++) {
    const coordinate = PLAYABLE_VERTICES[i]
    const piece = gameState[coordinate]
    if (piece && piece.ownedBy === player) {
      coordinates.push(coordinate)
    }
  }

  return coordinates
}

export function getAllPlayerPieceCoordinatesByType(
  gameState: typeof gameBoardState,
  player: Player,
  type: PlayerPieces
) {

  let coordinates = []

  for (let i = 0; i < PLAYABLE_VERTICES.length; i++) {
    const coordinate = PLAYABLE_VERTICES[i]
    const piece = gameState[coordinate]
    if (piece && piece.ownedBy === player && piece.type === type) {
      coordinates.push(coordinate)
    }
  }

  return coordinates
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

  let allGameStatesAfterMoveSeq = {}

  for (let i = 0; i < allOpponentPlayerPieces.length; i++) {
    const toCoordinate = allOpponentPlayerPieces[i] as ValidCoordinate
    const validCaptures = getInvertedValidCaptures(toCoordinate, gameState);
    // For every piece, get all possible captures
    // for each and put the resulting game state into a list.
    const allCaptureStates = validCaptures.reduce(
      (statesAfterCapture, fromCoordinate) => {
        // @ts-expect-error fix
        const fromPiece = Object.assign({}, gameState[fromCoordinate])
        const nextGameState = Object.assign({}, gameState)
        nextGameState[fromCoordinate] = null;
        nextGameState[toCoordinate] = fromPiece


        return statesAfterCapture.set(
          `${fromCoordinate}->${toCoordinate}`,
          nextGameState
        );
      },
      Map()
    );
    if (firstTurnOfGame) {
      allCaptureStates.forEach((stateAfterCapture, fromToKey) => {
        // @ts-expect-error fix
        allGameStatesAfterMoveSeq[fromToKey] = stateAfterCapture
      });
    }
    if (!firstTurnOfGame) {
      allCaptureStates.forEach((stateAfterCapture, fromToKey) => {
        if (trySecondCapture) {
          const allOpponentPlayerPieces = getAllPlayerPieceCoordinatesByType(
            // @ts-expect-error fix
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
              // @ts-expect-error fix
              const fromPiece = stateAfterCapture.get(fromCoordinate);
              const sequenceKey = `${fromToKey}=>${fromCoordinate}->${toCoordinate}`; // @ts-expect-error fix
              const gameStateAfterSecondCapture = Object.assign({}, stateAfterCapture)
              gameStateAfterSecondCapture[fromCoordinate] = null
              gameStateAfterSecondCapture[toCoordinate] = fromPiece

              allGameStatesAfterMoveSeq[sequenceKey] = gameStateAfterSecondCapture

            });
          });
        }

        let allPlayerPiecesAfterCapture = getAllPlayerPieceCoordinatesByType(
          // @ts-expect-error fix
          stateAfterCapture,
          turn,
          TZAAR
        );

        if (!allPlayerPiecesAfterCapture.length) {
          allPlayerPiecesAfterCapture = getAllPlayerPieceCoordinatesByType(
            // @ts-expect-error fix
            stateAfterCapture,
            turn,
            TZARRA
          );
        }
        if (!allPlayerPiecesAfterCapture.length) {
          allPlayerPiecesAfterCapture = getAllPlayerPieceCoordinatesByType(
            // @ts-expect-error fix
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
            // @ts-expect-error fix
            const fromPiece = stateAfterCapture[playerPieceCoordinateAfterCapture]

            validStacks.forEach((toCoordinate) => {
              // @ts-expect-error fix
              const toPiece = stateAfterCapture[toCoordinate]
              // @ts-expect-error fix
              const gameStateAfterMoveSeq = Object.assign({}, stateAfterCapture)
              gameStateAfterMoveSeq[playerPieceCoordinateAfterCapture] = null;
              gameStateAfterMoveSeq[toCoordinate] = Object.assign({}, fromPiece)
              gameStateAfterMoveSeq[toCoordinate].stackSize = fromPiece.stackSize + toPiece.stackSize

              const sequenceKey = `${fromToKey}=>${playerPieceCoordinateAfterCapture}->${toCoordinate}`;
              allGameStatesAfterMoveSeq[sequenceKey] = gameStateAfterMoveSeq
            });
          }
        );
      });
    }
  }

  return allGameStatesAfterMoveSeq
}

export function getPossibleMoveSequences(
  gameState: typeof gameBoardState,
  turn: Player
) {
  const allPlayerPieces = getAllPlayerPieceCoordinates(gameState, turn);

  return allPlayerPieces.reduce((allGameStatesAfterMoveSeq, fromCoordinate) => {
    const validCaptures = getValidCaptures(fromCoordinate, gameState);

    // For every piece, get all possible captures
    // for each and put the resulting game state into a list.
    const allCaptureStates = validCaptures.reduce(
      (statesAfterCapture, toCoordinate) => {
        const fromPiece = gameState[fromCoordinate];
        const nextGameState = Object.assign({}, gameState)
        nextGameState[fromCoordinate] = null;
        nextGameState[toCoordinate] = fromPiece

        return statesAfterCapture.set(
          `${fromCoordinate}->${toCoordinate}`,
          nextGameState
        );
      },
      Map()
    );

    // For every game state resulting from the above process,
    // get all player pieces and return all game states
    // for every valid stack you can make
    // @ts-expect-error fix
    allCaptureStates.forEach((stateAfterCapture, fromToKey: string) => {
      const allPlayerPiecesAfterCapture = getAllPlayerPieceCoordinates(
        // @ts-expect-error fix
        stateAfterCapture,
        turn
      );

      allPlayerPiecesAfterCapture.forEach(
        (playerPieceCoordinateAfterCapture) => {
          const validStacks = getValidStacks(
            playerPieceCoordinateAfterCapture, // @ts-expect-error fix
            stateAfterCapture
          );
          // @ts-expect-error fix
          const fromPiece = stateAfterCapture.get(
            playerPieceCoordinateAfterCapture
          );

          // 2nd phase - stack
          if (validStacks && validStacks.size) {
            validStacks.forEach((toCoordinate) => {
              // @ts-expect-error fix
              const toPiece = stateAfterCapture.get(toCoordinate);
              // @ts-expect-error fix
              const gameStateAfterMoveSeq = stateAfterCapture
                .set(playerPieceCoordinateAfterCapture, null)
                .set(toCoordinate, fromPiece)
                .setIn(
                  [toCoordinate, "stackSize"],
                  fromPiece.stackSize + toPiece.stackSize
                );

              const sequenceKey = `${fromToKey}=>${playerPieceCoordinateAfterCapture}->${toCoordinate}`;

              allGameStatesAfterMoveSeq = allGameStatesAfterMoveSeq.set(
                sequenceKey,
                gameStateAfterMoveSeq
              );
            });
          }
          const validSecondTurnCaptures = getValidCaptures(
            playerPieceCoordinateAfterCapture, // @ts-expect-error fix
            stateAfterCapture
          );

          // 2nd phase - capture
          if (validSecondTurnCaptures && validSecondTurnCaptures.size) {
            validSecondTurnCaptures.forEach((toCoordinate) => {
              // @ts-expect-error fix
              const nextGameState = stateAfterCapture
                .set(playerPieceCoordinateAfterCapture, null)
                .set(toCoordinate, fromPiece);
              const sequenceKey = `${fromToKey}=>${playerPieceCoordinateAfterCapture}->${toCoordinate}`;

              allGameStatesAfterMoveSeq = allGameStatesAfterMoveSeq.set(
                sequenceKey,
                nextGameState
              );
            });
          }
          // We can just capture, then pass
          allGameStatesAfterMoveSeq = allGameStatesAfterMoveSeq.set(
            fromToKey,
            stateAfterCapture
          );
        }
      );
    });

    return allGameStatesAfterMoveSeq;
  }, Map());
}
