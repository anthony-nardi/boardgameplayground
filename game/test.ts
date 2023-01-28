// window && window.testMinimax = function() {
//   const setupToTest = setupBoardWithPiecesNotRandom();

//   let gameState = gameBoardState;

//   setupToTest.forEach((piece, boardCoordinate) => {
//     gameState = gameState.set(boardCoordinate, piece);
//   });

//   const startingMoves = getGameStatesToAnalyze(gameState, PLAYER_TWO);
//   console.log(`starting moves to check : ${startingMoves.size}`);
//   // console.time(`${allMovesToCheck.size} depth 1`);

//   // allMovesToCheck.map(gameStateToCheck => {
//   //   return minimax(gameStateToCheck, PLAYER_ONE, 1);
//   // });
//   // console.timeEnd(`${allMovesToCheck.size} depth 1`);

//   window && window.minimaxIterations = 0;

//   const minimaxResult = minimax(gameState, PLAYER_TWO, 2);

//   console.log(`TOTAL ITERATIONS ${window && window.minimaxIterations}`);
// };

// testMinimax();

// window && window.getGameStateScore = getGameStateScore;

// window && window.testScoring = function() {
//   const STARTING = Map({
//     // OUTER RING
//     "4,0": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "5,0": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "6,0": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "7,0": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "8,0": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "8,1": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "8,2": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "8,3": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "8,4": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "7,5": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "6,6": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "5,7": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "4,8": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "3,8": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "2,8": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "1,8": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "0,8": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "0,7": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "0,6": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "0,5": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "0,4": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "1,3": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "2,2": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "3,1": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     // OUTER RING - 1
//     "4,1": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "5,1": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "6,1": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "7,1": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     "7,2": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     "7,3": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     "7,4": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "6,5": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "5,6": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "4,7": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     "3,7": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     "2,7": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     "1,7": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "1,6": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "1,5": null,
//     "1,4": null,
//     "2,3": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     "3,2": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     // OUTER RING - 2
//     "4,2": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_ONE }),
//     "5,2": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_ONE }),
//     "6,2": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_TWO }),
//     "6,3": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_TWO }),
//     "6,4": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_ONE }),
//     "5,5": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_TWO }),
//     "4,6": null,
//     "3,6": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_TWO }),
//     "2,6": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_ONE }),
//     "2,5": null,
//     "2,4": new GamePieceRecord({
//       type: TZARRA,
//       ownedBy: PLAYER_ONE,
//       stackSize: 2
//     }),
//     "3,3": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_TWO }),
//     // INNER RING
//     "4,3": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "5,3": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "5,4": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "4,5": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "3,5": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "3,4": new GamePieceRecord({
//       type: TZAAR,
//       ownedBy: PLAYER_TWO,
//       stackSize: 2
//     })
//   });

//   const CATPURE_STACK = Map({
//     // OUTER RING
//     "5,0": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "4,0": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "6,0": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "7,0": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "8,0": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "8,1": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "8,2": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "8,3": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "8,4": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "7,5": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "6,6": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "5,7": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "4,8": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "3,8": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "2,8": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "1,8": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "0,8": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "0,7": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "0,6": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "0,5": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "0,4": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "1,3": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "2,2": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "3,1": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     // OUTER RING - 1
//     "4,1": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "5,1": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "6,1": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "7,1": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     "7,2": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     "7,3": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     "7,4": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "6,5": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "5,6": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "4,7": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     "3,7": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     "2,7": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     "1,7": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "1,6": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "1,5": null,
//     "1,4": null,
//     "2,3": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     "3,2": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     // OUTER RING - 2
//     "4,2": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_ONE }),
//     "5,2": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_ONE }),
//     "6,2": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_TWO }),
//     "6,3": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_TWO }),
//     "6,4": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_ONE }),
//     "5,5": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_TWO }),
//     "4,6": null,
//     "3,6": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_TWO }),
//     "2,6": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_ONE }),
//     "2,5": null,
//     "2,4": new GamePieceRecord({
//       type: TZAAR,
//       ownedBy: PLAYER_TWO,
//       stackSize: 2
//     }),
//     "3,3": null,
//     // INNER RING
//     "4,3": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "5,3": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "5,4": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "4,5": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "3,5": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "3,4": null
//   });
//   const CAPTURE_TZAAR = Map({
//     // OUTER RING
//     "4,0": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "5,0": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "6,0": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "7,0": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "8,0": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "8,1": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "8,2": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "8,3": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "8,4": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "7,5": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "6,6": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "5,7": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "4,8": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "3,8": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "2,8": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "1,8": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "0,8": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "0,7": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "0,6": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "0,5": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "0,4": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "1,3": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "2,2": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "3,1": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     // OUTER RING - 1
//     "4,1": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "5,1": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "6,1": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "7,1": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     "7,2": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     "7,3": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     "7,4": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "6,5": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "5,6": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "4,7": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     "3,7": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     "2,7": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     "1,7": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "1,6": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
//     "1,5": null,
//     "1,4": null,
//     "2,3": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     "3,2": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
//     // OUTER RING - 2
//     "4,2": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_ONE }),
//     "5,2": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_ONE }),
//     "6,2": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_TWO }),
//     "6,3": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_TWO }),
//     "6,4": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_ONE }),
//     "5,5": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_TWO }),
//     "4,6": null,
//     "3,6": null,
//     "2,6": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_TWO }),
//     "2,5": null,
//     "2,4": new GamePieceRecord({
//       type: TZARRA,
//       ownedBy: PLAYER_ONE,
//       stackSize: 2
//     }),
//     "3,3": null,
//     // INNER RING
//     "4,3": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "5,3": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "5,4": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "4,5": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
//     "3,5": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
//     "3,4": new GamePieceRecord({
//       type: TZAAR,
//       ownedBy: PLAYER_TWO,
//       stackSize: 2
//     })
//   });
//   getGameStateScore(CATPURE_STACK);
//   debugger;
//   getGameStateScore(CAPTURE_TZAAR);
//   debugger;
// };

// testScoring();
