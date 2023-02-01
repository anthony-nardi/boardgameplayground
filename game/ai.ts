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

import { currentTurn, gameBoardState, numberOfTurnsIntoGame } from "./gameState";
import {
  getValidCaptures,
  getValidStacks,
  getInvertedValidCaptures,
} from "./gameBoardHelpers";
import { Player, ValidCoordinate } from "./types/types";

const scoringMapRecord = Map({
  [PLAYER_ONE]: Map({
    [TOTT]: Map({
      count: 0,
      stacksGreaterThanOne: 0,
      largestStackSize: 0,
      stacksOnEdge: 0,
      stacksOnCorner: 0,
      coordinate: null,
    }),
    [TZARRA]: Map({
      count: 0,
      stacksGreaterThanOne: 0,
      largestStackSize: 0,
      stacksOnEdge: 0,
      stacksOnCorner: 0,
      coordinate: null,
    }),
    [TZAAR]: Map({
      count: 0,
      stacksGreaterThanOne: 0,
      largestStackSize: 0,
      stacksOnEdge: 0,
      stacksOnCorner: 0,
      coordinate: null,
    }),
  }),
  [PLAYER_TWO]: Map({
    [TOTT]: Map({
      count: 0,
      stacksGreaterThanOne: 0,
      largestStackSize: 0,
      stacksOnEdge: 0,
      stacksOnCorner: 0,
      coordinate: null,
    }),
    [TZARRA]: Map({
      count: 0,
      stacksGreaterThanOne: 0,
      largestStackSize: 0,
      stacksOnEdge: 0,
      stacksOnCorner: 0,
      coordinate: null,
    }),
    [TZAAR]: Map({
      count: 0,
      stacksGreaterThanOne: 0,
      largestStackSize: 0,
      stacksOnEdge: 0,
      stacksOnCorner: 0,
      coordinate: null,
    }),
  }),
});

function getScoreForHighestStack(currentStack: number, stackToBeat: number) {
  if (currentStack > stackToBeat) {
    return 20;
  }

  if (currentStack < stackToBeat) {
    return -20;
  }

  return 0;
}

function getScoreForEdgesAndCorners(edges: number, corners: number) {
  return edges * 5 + corners * 10;
}

export function getGameStateScore(gameState: typeof gameBoardState) {

  const scoringMap = gameState.reduce((piecesByPlayer, piece, coordinate: ValidCoordinate) => {
    if (!piece) {
      return piecesByPlayer;
    }

    const { ownedBy, type, stackSize } = piece;
    return piecesByPlayer
      // @ts-expect-error fix
      .updateIn([ownedBy, type, "count"], (count: number) => count + 1)
      .updateIn(
        [ownedBy, type, "stacksGreaterThanOne"],// @ts-expect-error fix

        (stacks: number) => stacks + Number(stackSize)
      )
      // @ts-expect-error fix
      .updateIn([ownedBy, type, "largestStackSize"], (largestStackSize: number) =>
        Math.max(largestStackSize, Number(stackSize))
      )
      // @ts-expect-error fix
      .updateIn([ownedBy, type, "stacksOnEdge"], (stacksOnEdge: number) => {
        // @ts-expect-error fix
        if (stackSize > 1 && EDGE_COORDINATES.includes(coordinate)) {
          return stacksOnEdge + 1;
        }
        return stacksOnEdge;
      })
      // @ts-expect-error fix
      .updateIn([ownedBy, type, "stacksOnCorner"], (stacksOnCorner: number) => {
        // @ts-expect-error fix
        if (stackSize > 1 && CORNER_COORDINATES.includes(coordinate)) {
          return stacksOnCorner + 1;
        }
        return stacksOnCorner;
      })
      .setIn([ownedBy, type, "coordinate"], coordinate);
  }, scoringMapRecord);

  let score = 0;
  // @ts-expect-error fix
  scoringMap.get(PLAYER_ONE).forEach((data, pieceType: typeof TZAAR | typeof TZARRA | typeof TOTT) => {
    score =
      score -
      // @ts-expect-error fix
      getScoreForStacks(data.get("count"), data.get("stacksGreaterThanOne")) -
      getScoreForHighestStack(
        // @ts-expect-error fix
        data.get("largestStackSize"),
        scoringMap.getIn([PLAYER_TWO, pieceType, "largestStackSize"])
      ) +
      getScoreForEdgesAndCorners(
        // @ts-expect-error fix
        data.get("stacksOnEdge"),
        data.get("stacksOnCorner")
      );
  });
  // @ts-expect-error fix
  scoringMap.get(PLAYER_TWO).forEach((data, pieceType: typeof TZAAR | typeof TZARRA | typeof TOTT) => {
    score =
      score +
      // @ts-expect-error fix
      getScoreForStacks(data.get("count"), data.get("stacksGreaterThanOne")) +
      getScoreForHighestStack(// @ts-expect-error fix
        data.get("largestStackSize"),
        scoringMap.getIn([PLAYER_ONE, pieceType, "largestStackSize"])
      ) -
      getScoreForEdgesAndCorners(
        // @ts-expect-error fix
        data.get("stacksOnEdge"),
        data.get("stacksOnCorner")
      );
  });

  return score;
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

export function getWinner(gameState: typeof gameBoardState) {
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

  const possibleCaptures = getAllPlayerPieceCoordinates(
    gameState,// @ts-expect-error fix
    currentTurn
  ).map((fromCoordinate) => {
    return getValidCaptures(fromCoordinate, gameState);
  });
  // @ts-expect-error fix
  if (!possibleCaptures.find((possibleCapture) => possibleCapture.size)) {
    return currentTurn === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
  }
}

export function getGameStatesToAnalyze(gameState: typeof gameBoardState, turn: Player) {
  const EARLY_GAME = numberOfTurnsIntoGame < 10;
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
