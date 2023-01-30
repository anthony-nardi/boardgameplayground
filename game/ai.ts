import { List, Map } from "immutable";
import {
  TZAAR,
  TOTT,
  TZARRA,
  PLAYER_ONE,
  PLAYER_TWO,
  CORNER_COORDINATES,
  EDGE_COORDINATES,
} from "./constants";

import { currentTurn, numberOfTurnsIntoGame } from "./gameState";
import {
  getValidCaptures,
  getValidStacks,
  getInvertedValidCaptures,
} from "./gameBoardHelpers";

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

function getScoreForHighestStack(currentStack, stackToBeat) {
  if (currentStack > stackToBeat) {
    return 20;
  }

  if (currentStack < stackToBeat) {
    return -20;
  }

  return 0;
}

function getScoreForEdgesAndCorners(edges, corners) {
  return edges * 5 + corners * 10;
}

export function getGameStateScore(gameState) {

  const scoringMap = gameState.reduce((piecesByPlayer, piece, coordinate) => {
    if (!piece) {
      return piecesByPlayer;
    }

    const { ownedBy, type, stackSize } = piece;
    return piecesByPlayer
      .updateIn([ownedBy, type, "count"], (count) => count + 1)
      .updateIn(
        [ownedBy, type, "stacksGreaterThanOne"],
        (stacks) => stacks + Number(stackSize)
      )
      .updateIn([ownedBy, type, "largestStackSize"], (largestStackSize) =>
        Math.max(largestStackSize, Number(stackSize))
      )
      .updateIn([ownedBy, type, "stacksOnEdge"], (stacksOnEdge) => {
        if (stackSize > 1 && EDGE_COORDINATES.includes(coordinate)) {
          return stacksOnEdge + 1;
        }
        return stacksOnEdge;
      })
      .updateIn([ownedBy, type, "stacksOnCorner"], (stacksOnCorner) => {
        if (stackSize > 1 && CORNER_COORDINATES.includes(coordinate)) {
          return stacksOnCorner + 1;
        }
        return stacksOnCorner;
      })
      .setIn([ownedBy, type, "coordinate"], coordinate);
  }, scoringMapRecord);

  let score = 0;

  scoringMap.get(PLAYER_ONE).forEach((data, pieceType) => {
    score =
      score -
      getScoreForStacks(data.get("count"), data.get("stacksGreaterThanOne")) -
      getScoreForHighestStack(
        data.get("largestStackSize"),
        scoringMap.getIn([PLAYER_TWO, pieceType, "largestStackSize"])
      ) +
      getScoreForEdgesAndCorners(
        data.get("stacksOnEdge"),
        data.get("stacksOnCorner")
      );
  });

  scoringMap.get(PLAYER_TWO).forEach((data, pieceType) => {
    score =
      score +
      getScoreForStacks(data.get("count"), data.get("stacksGreaterThanOne")) +
      getScoreForHighestStack(
        data.get("largestStackSize"),
        scoringMap.getIn([PLAYER_ONE, pieceType, "largestStackSize"])
      ) -
      getScoreForEdgesAndCorners(
        data.get("stacksOnEdge"),
        data.get("stacksOnCorner")
      );
  });

  return score;
}

// we value stacks depending on how many of that type are on the board
function getScoreForStacks(numberOfPieces, stackSize) {
  const MULTIPLIER = 15;

  return (MULTIPLIER - numberOfPieces) * stackSize;
}

export function minimax(
  gameState,
  turn,
  depth,
  alpha = -Infinity,
  beta = Infinity
) {
  const winner = getWinner(gameState);
  if (winner === PLAYER_ONE) {
    return [-Infinity];
  }
  if (winner === PLAYER_TWO) {
    return [Infinity];
  }

  if (depth === 0) {
    return [getGameStateScore(gameState)];
  }

  // maximizing player
  if (turn === PLAYER_TWO) {
    let bestValue = -Infinity;
    let moveSeq = null;

    // choose max score after player one makes his move
    const gameStatesToAnalyze = getGameStatesToAnalyze(gameState, PLAYER_TWO);
    gameStatesToAnalyze.forEach((nextGameState, nextMoveSeq) => {
      const [maybeBetterValue] = minimax(
        nextGameState,
        PLAYER_ONE,
        depth - 1,
        alpha,
        beta
      );
      if (maybeBetterValue >= bestValue) {
        bestValue = maybeBetterValue;
        moveSeq = nextMoveSeq;
      }

      alpha = Math.max(bestValue, alpha);

      if (alpha >= beta) {
        return false;
      }
    });

    return [bestValue, moveSeq];
  }

  // minimizing player
  if (turn === PLAYER_ONE) {
    let bestValue = Infinity;
    let moveSeq = null;
    // choose lowest score after player two makes move
    const gameStatesToAnalyze = getGameStatesToAnalyze(gameState, PLAYER_ONE);

    gameStatesToAnalyze.forEach((nextGameState, nextMoveSeq) => {
      const [maybeWorseValue] = minimax(
        nextGameState,
        PLAYER_TWO,
        depth - 1,
        alpha,
        beta
      );

      if (maybeWorseValue <= bestValue) {
        bestValue = maybeWorseValue;
        moveSeq = nextMoveSeq;
      }

      beta = Math.min(beta, bestValue);

      if (alpha >= beta) {
        return false;
      }
    });

    return [bestValue, moveSeq];
  }
}

function getPieces(gameState) {
  return gameState.reduce(
    (piecesByPlayer, piece) => {
      if (!piece) {
        return piecesByPlayer;
      }
      const { ownedBy, type } = piece;
      return piecesByPlayer.updateIn([ownedBy, type], (pieces) =>
        pieces.push(piece)
      );
    },
    Map({
      [PLAYER_ONE]: Map({
        [TOTT]: List(),
        [TZARRA]: List(),
        [TZAAR]: List(),
      }),
      [PLAYER_TWO]: Map({
        [TOTT]: List(),
        [TZARRA]: List(),
        [TZAAR]: List(),
      }),
    })
  );
}

export function getWinner(gameState) {
  const pieceCountsByPlayer = getPieces(gameState);

  const playerOneLost =
    !pieceCountsByPlayer.getIn([PLAYER_ONE, TOTT]).size ||
    !pieceCountsByPlayer.getIn([PLAYER_ONE, TZARRA]).size ||
    !pieceCountsByPlayer.getIn([PLAYER_ONE, TZAAR]).size;

  const playerTwoLost =
    !pieceCountsByPlayer.getIn([PLAYER_TWO, TOTT]).size ||
    !pieceCountsByPlayer.getIn([PLAYER_TWO, TZARRA]).size ||
    !pieceCountsByPlayer.getIn([PLAYER_TWO, TZAAR]).size;

  if (playerOneLost) {
    return PLAYER_TWO;
  }
  if (playerTwoLost) {
    return PLAYER_ONE;
  }

  const possibleCaptures = getAllPlayerPieceCoordinates(
    gameState,
    currentTurn
  ).map((fromCoordinate) => {
    return getValidCaptures(fromCoordinate, gameState);
  });

  if (!possibleCaptures.find((possibleCapture) => possibleCapture.size)) {
    return currentTurn === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
  }
}

export function getGameStatesToAnalyze(gameState, turn) {
  const EARLY_GAME = numberOfTurnsIntoGame < 10;
  let allPossibleStatesAfterTurn = List();
  debugger
  if (!EARLY_GAME) {
    allPossibleStatesAfterTurn = getPossibleMoveSequences(gameState, turn);
  } else {
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

export function getAllPlayerPieceCoordinates(gameState, player) {
  return gameState
    .filter((piece) => piece && piece.ownedBy === player)
    .keySeq();
}

export function getAllPlayerPieceCoordinatesByType(gameState, player, type) {
  return gameState
    .filter((piece) => piece && piece.ownedBy === player && piece.type === type)
    .keySeq();
}

function getEarlyGamePossibleMoveSequences(gameState, PIECE_TYPE, turn) {
  const playerPiecesToCapture = turn === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
  let trySecondCapture = false;

  // get opponents most valuable pieces to capture.
  const allOpponentPlayerPieces = getAllPlayerPieceCoordinatesByType(
    gameState,
    playerPiecesToCapture,
    PIECE_TYPE
  );

  if (allOpponentPlayerPieces.size <= 2) {
    trySecondCapture = true;
  }

  return allOpponentPlayerPieces.reduce(
    (allGameStatesAfterMoveSeq, toCoordinate) => {
      const validCaptures = getInvertedValidCaptures(toCoordinate, gameState);

      // For every piece, get all possible captures
      // for each and put the resulting game state into a list.
      const allCaptureStates = validCaptures.reduce(
        (statesAfterCapture, fromCoordinate) => {
          const fromPiece = gameState.get(fromCoordinate);
          const nextGameState = gameState
            .set(fromCoordinate, null)
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

        let allPlayerPiecesAfterCapture = getAllPlayerPieceCoordinatesByType(
          stateAfterCapture,
          turn,
          TZAAR
        );

        if (!allPlayerPiecesAfterCapture.size) {
          allPlayerPiecesAfterCapture = getAllPlayerPieceCoordinatesByType(
            stateAfterCapture,
            turn,
            TZARRA
          );
        }
        if (!allPlayerPiecesAfterCapture.size) {
          allPlayerPiecesAfterCapture = getAllPlayerPieceCoordinatesByType(
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
              playerPieceCoordinateAfterCapture,
              stateAfterCapture
            );

            const fromPiece = stateAfterCapture.get(
              playerPieceCoordinateAfterCapture
            );
            validStacks.forEach((toCoordinate) => {
              const toPiece = stateAfterCapture.get(toCoordinate);

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

export function generateMoves(gameState, turn) {
  const allPlayerPieces = getAllPlayerPieceCoordinates(gameState, turn);

  return allPlayerPieces.reduce((allGameStatesAfterMoveSeq, fromCoordinate) => {
    const validCaptures = getValidCaptures(fromCoordinate, gameState);

    // For every piece, get all possible captures
    // for each and put the resulting game state into a list.
    const allCaptureStates = validCaptures.reduce(
      (statesAfterCapture, toCoordinate) => {
        const fromPiece = gameState.get(fromCoordinate);
        const nextGameState = gameState
          .set(fromCoordinate, null)
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
      const allPlayerPiecesAfterCapture = getAllPlayerPieceCoordinates(
        stateAfterCapture,
        turn
      );

      allPlayerPiecesAfterCapture.forEach(
        (playerPieceCoordinateAfterCapture) => {
          const validStacks = getValidStacks(
            playerPieceCoordinateAfterCapture,
            stateAfterCapture
          );

          const fromPiece = stateAfterCapture.get(
            playerPieceCoordinateAfterCapture
          );

          if (validStacks && validStacks.size) {
            validStacks.forEach((toCoordinate) => {
              const toPiece = stateAfterCapture.get(toCoordinate);

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
            playerPieceCoordinateAfterCapture,
            stateAfterCapture
          );
          if (validSecondTurnCaptures && validSecondTurnCaptures.size) {
            validSecondTurnCaptures.forEach((toCoordinate) => {
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

export function getPossibleMoveSequences(gameState, turn) {
  const allPlayerPieces = getAllPlayerPieceCoordinates(gameState, turn);

  return allPlayerPieces.reduce((allGameStatesAfterMoveSeq, fromCoordinate) => {
    const validCaptures = getValidCaptures(fromCoordinate, gameState);

    // For every piece, get all possible captures
    // for each and put the resulting game state into a list.
    const allCaptureStates = validCaptures.reduce(
      (statesAfterCapture, toCoordinate) => {
        const fromPiece = gameState.get(fromCoordinate);
        const nextGameState = gameState
          .set(fromCoordinate, null)
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
      const allPlayerPiecesAfterCapture = getAllPlayerPieceCoordinates(
        stateAfterCapture,
        turn
      );

      allPlayerPiecesAfterCapture.forEach(
        (playerPieceCoordinateAfterCapture) => {
          const validStacks = getValidStacks(
            playerPieceCoordinateAfterCapture,
            stateAfterCapture
          );

          const fromPiece = stateAfterCapture.get(
            playerPieceCoordinateAfterCapture
          );

          if (validStacks && validStacks.size) {
            validStacks.forEach((toCoordinate) => {
              const toPiece = stateAfterCapture.get(toCoordinate);

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
            playerPieceCoordinateAfterCapture,
            stateAfterCapture
          );
          if (validSecondTurnCaptures && validSecondTurnCaptures.size) {
            validSecondTurnCaptures.forEach((toCoordinate) => {
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
