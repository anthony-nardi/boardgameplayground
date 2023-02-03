import { List, Map } from "immutable";
import {
  TZAAR,
  TOTT,
  TZARRA,
  PLAYER_ONE,
  PLAYER_TWO,
} from "./constants";
import { gameBoardState, numberOfTurnsIntoGame } from "./gameState";
import {
  getValidCaptures,
  getValidStacks,
  getInvertedValidCaptures,
} from "./gameBoardHelpers";
import { Player, ValidCoordinate } from "./types/types";

export function getGameStatesToAnalyze(gameState: typeof gameBoardState, turn: Player) {
  // const EARLY_GAME = numberOfTurnsIntoGame < 10;
  const EARLY_GAME = false
  let allPossibleStatesAfterTurn = List();

  if (!EARLY_GAME) {// @ts-expect-error fix
    allPossibleStatesAfterTurn = getPossibleMoveSequences(gameState, turn);
  } else {// @ts-expect-error fix
    allPossibleStatesAfterTurn = getEarlyGamePossibleMoveSequences(
      gameState,
      TZAAR,
      turn
    )
      .concat(getEarlyGamePossibleMoveSequences(gameState, TZARRA, turn))
      .concat(getEarlyGamePossibleMoveSequences(gameState, TOTT, turn));
  }

  return allPossibleStatesAfterTurn;
}

export function getAllPlayerPieceCoordinates(gameState: typeof gameBoardState, player: Player) {
  return gameState
    .filter((piece) => piece && piece.ownedBy === player)
    .keySeq();
}
// @ts-expect-error fix
export function getAllPlayerPieceCoordinatesByType(gameState: typeof gameBoardState, player: Player, type) {
  return gameState
    .filter((piece) => piece && piece.ownedBy === player && piece.type === type)
    .keySeq();
}
// @ts-expect-error fix
function getEarlyGamePossibleMoveSequences(gameState: typeof gameBoardState, PIECE_TYPE, turn: Player) {
  const playerPiecesToCapture = turn === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
  let trySecondCapture = false;

  // get opponents most valuable pieces to capture.
  const allOpponentPlayerPieces = getAllPlayerPieceCoordinatesByType(
    gameState,
    playerPiecesToCapture,
    PIECE_TYPE
  );
  // @ts-expect-error fix
  if (allOpponentPlayerPieces.size <= 2) {
    trySecondCapture = true;
  }

  return allOpponentPlayerPieces.reduce(
    (allGameStatesAfterMoveSeq, toCoordinate) => {
      const validCaptures = getInvertedValidCaptures(toCoordinate, gameState);

      // For every piece, get all possible captures
      // for each and put the resulting game state into a list.
      const allCaptureStates = validCaptures.reduce(
        (statesAfterCapture, fromCoordinate) => {// @ts-expect-error fix
          const fromPiece = gameState.get(fromCoordinate);
          const nextGameState = gameState// @ts-expect-error fix
            .set(fromCoordinate, null)// @ts-expect-error fix
            .set(toCoordinate, fromPiece);
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
      allCaptureStates.forEach((stateAfterCapture, fromToKey) => {
        if (trySecondCapture) {
          const allOpponentPlayerPieces = getAllPlayerPieceCoordinatesByType(// @ts-expect-error fix
            stateAfterCapture,
            playerPiecesToCapture,
            PIECE_TYPE
          );
          allOpponentPlayerPieces.forEach((toCoordinate) => {
            const validCaptures = getInvertedValidCaptures(
              toCoordinate,// @ts-expect-error fix
              stateAfterCapture
            );

            validCaptures.forEach((fromCoordinate) => {// @ts-expect-error fix
              const fromPiece = stateAfterCapture.get(fromCoordinate);
              const sequenceKey = `${fromToKey}=>${fromCoordinate}->${toCoordinate}`;// @ts-expect-error fix
              const gameStateAfterSecondCapture = stateAfterCapture
                .set(fromCoordinate, null)
                .set(toCoordinate, fromPiece);
              allGameStatesAfterMoveSeq = allGameStatesAfterMoveSeq.set(
                sequenceKey,
                gameStateAfterSecondCapture
              );
            });
          });
        }

        let allPlayerPiecesAfterCapture = getAllPlayerPieceCoordinatesByType(// @ts-expect-error fix
          stateAfterCapture,
          turn,
          TZAAR
        );

        if (!allPlayerPiecesAfterCapture.size) {
          allPlayerPiecesAfterCapture = getAllPlayerPieceCoordinatesByType(// @ts-expect-error fix
            stateAfterCapture,
            turn,
            TZARRA
          );
        }
        if (!allPlayerPiecesAfterCapture.size) {
          allPlayerPiecesAfterCapture = getAllPlayerPieceCoordinatesByType(// @ts-expect-error fix
            stateAfterCapture,
            turn,
            TOTT
          );
        }
        if (!allPlayerPiecesAfterCapture.size) {
          alert("This shouldnt be possible, let me know if you see this.");
        }

        allPlayerPiecesAfterCapture.forEach(
          (playerPieceCoordinateAfterCapture) => {
            const validStacks = getValidStacks(
              playerPieceCoordinateAfterCapture,// @ts-expect-error fix
              stateAfterCapture
            );
            // @ts-expect-error fix
            const fromPiece = stateAfterCapture.get(
              playerPieceCoordinateAfterCapture
            );
            validStacks.forEach((toCoordinate) => {// @ts-expect-error fix
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
        );
      });

      return allGameStatesAfterMoveSeq;
    },
    Map()
  );
}

export function getPossibleMoveSequences(gameState: typeof gameBoardState, turn: Player) {
  const allPlayerPieces = getAllPlayerPieceCoordinates(gameState, turn);

  return allPlayerPieces.reduce((allGameStatesAfterMoveSeq, fromCoordinate) => {
    const validCaptures = getValidCaptures(fromCoordinate, gameState);

    // For every piece, get all possible captures
    // for each and put the resulting game state into a list.
    const allCaptureStates = validCaptures.reduce(
      (statesAfterCapture, toCoordinate) => {
        const fromPiece = gameState.get(fromCoordinate);
        const nextGameState = gameState// @ts-expect-error fix
          .set(fromCoordinate, null)// @ts-expect-error fix
          .set(toCoordinate, fromPiece);
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
      const allPlayerPiecesAfterCapture = getAllPlayerPieceCoordinates(// @ts-expect-error fix
        stateAfterCapture,
        turn
      );

      allPlayerPiecesAfterCapture.forEach(
        (playerPieceCoordinateAfterCapture) => {
          const validStacks = getValidStacks(
            playerPieceCoordinateAfterCapture,// @ts-expect-error fix
            stateAfterCapture
          );
          // @ts-expect-error fix
          const fromPiece = stateAfterCapture.get(
            playerPieceCoordinateAfterCapture
          );

          if (validStacks && validStacks.size) {
            validStacks.forEach((toCoordinate) => {// @ts-expect-error fix
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
            playerPieceCoordinateAfterCapture,// @ts-expect-error fix
            stateAfterCapture
          );
          // console.log(validSecondTurnCaptures.toJS())
          if (validSecondTurnCaptures && validSecondTurnCaptures.size) {
            validSecondTurnCaptures.forEach((toCoordinate) => {// @ts-expect-error fix
              const nextGameState = stateAfterCapture
                .set(playerPieceCoordinateAfterCapture, null)
                .set(toCoordinate, fromPiece);
              const sequenceKey = `${fromToKey}=>${playerPieceCoordinateAfterCapture}->${toCoordinate}`;

              allGameStatesAfterMoveSeq = allGameStatesAfterMoveSeq.set(
                sequenceKey,
                nextGameState
              );

              console.log(sequenceKey)
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
