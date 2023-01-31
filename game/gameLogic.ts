import {
  PLAYER_TWO,
  PLAYER_ONE,
  TURN_PHASES,

} from "./constants";
import { drawInitialGrid } from "./cachedBoard";
import {
  drawCoordinates,
  drawGameBoardState,
  drawGamePiece,
  renderMovingPiece,
  renderInitializingBoard,
} from "./renderHelpers";
import {
  getBoardCoordinatesFromPixelCoordinates,
  getPixelCoordinatesFromBoardCoordinates,
  setupBoardWithPieces,
  setupBoardWithPiecesNotRandom,
  getValidCaptures,
  getValidStacks,
} from "./gameBoardHelpers";
import {
  movingPiece,
  gameBoardState,
  setNewgameBoardState,
  setMovingPiece,
  nextPhase,
  currentTurn,
  turnPhase,
} from "./gameState";
import { getGameStatesToAnalyze, minimax, getWinner, getGameStateScore } from "./ai";
import * as minimaxer from "minimaxer";
import React from "react";
const DEBUG = false
function getPixelCoordinatesFromUserInteraction(event: React.MouseEvent<HTMLCanvasElement>) {
  const x = event.clientX;
  const y = event.clientY;
  return [x, y];
}

function isCurrentPlayerPiece(boardCoordinate) {
  return gameBoardState.getIn([boardCoordinate, "ownedBy"]) === currentTurn;
}

export function handleClickPiece(event) {
  const [x, y] = getPixelCoordinatesFromUserInteraction(event);
  const boardCoordinate = getBoardCoordinatesFromPixelCoordinates(x, y);

  if (!isCurrentPlayerPiece(boardCoordinate)) {
    return;
  }

  if (currentTurn === PLAYER_TWO) {
    return;
  }

  setNewgameBoardState(
    gameBoardState.setIn([boardCoordinate, "isDragging"], true)
  );
  setMovingPiece(boardCoordinate);
}

export function handleMovePiece(event) {
  if (!movingPiece) {
    return;
  }

  const [x, y] = getPixelCoordinatesFromUserInteraction(event);
  drawGameBoardState();
  drawGamePiece(gameBoardState.get(movingPiece), x, y);
}

export function handleDropPiece(event) {
  if (!movingPiece) {
    return;
  }

  const [x, y] = getPixelCoordinatesFromUserInteraction(event);
  const toCoordinates = getBoardCoordinatesFromPixelCoordinates(x, y);

  setNewgameBoardState(
    gameBoardState.setIn([movingPiece, "isDragging"], false)
  );

  if (!gameBoardState.get(toCoordinates)) {
    setMovingPiece(null);
    drawGameBoardState();
    return;
  }

  const validCaptures = getValidCaptures(movingPiece, gameBoardState);
  const validStacks = getValidStacks(movingPiece, gameBoardState);
  const isValidCapture = validCaptures.includes(toCoordinates);
  const isValidStack = validStacks.includes(toCoordinates);

  if (turnPhase === TURN_PHASES.CAPTURE && isValidCapture) {
    capturePiece(movingPiece, toCoordinates);
  } else if (turnPhase === TURN_PHASES.STACK_OR_CAPTURE_OR_PASS) {
    if (isValidCapture) {
      capturePiece(movingPiece, toCoordinates);
    } else if (isValidStack) {
      stackPiece(movingPiece, toCoordinates);
    }
  }

  setMovingPiece(null);
  drawGameBoardState();

  if (turnPhase === TURN_PHASES.CAPTURE && currentTurn === PLAYER_TWO) {
    // document.getElementById("loadingSpinner").classList.remove("hidden");
    setTimeout(() => moveAI(), 50);
  }
}

function capturePiece(fromCoordinates, toCoordinates) {
  const fromPiece = gameBoardState.get(fromCoordinates);
  setNewgameBoardState(
    gameBoardState.set(fromCoordinates, false).set(toCoordinates, fromPiece)
  );
  checkGameStateAndStartNextTurn();
}

function stackPiece(fromCoordinates, toCoordinates) {
  const fromPiece = gameBoardState.get(fromCoordinates);
  const toPiece = gameBoardState.get(toCoordinates);

  setNewgameBoardState(
    gameBoardState
      .set(fromCoordinates, false)
      .set(toCoordinates, fromPiece)
      .setIn(
        [toCoordinates, "stackSize"],
        fromPiece.stackSize + toPiece.stackSize
      )
  );
  checkGameStateAndStartNextTurn();
}


function checkGameStateAndStartNextTurn() {
  nextPhase();

  const winner = getWinner(gameBoardState);
  let message = winner === PLAYER_TWO ? "You lost." : "You won!";
  if (winner) {
    alert(`${message}`);
    location.reload();
  }
}

export const createChildCallback = (node, move) => {
  // First create a clone of the gamestate
  // debugger
  let gamestateToAnalyze;
  console.log('child node')

  const aim = node.aim * -1

  if (!node.gamestate.gamestate) {

    gamestateToAnalyze = node.gamestate
  } else {
    gamestateToAnalyze = node.gamestate.gamestate
  }



  const updatedBoardGameState = applyMoveToGameState(gamestateToAnalyze, move)
  const childNode = new minimaxer.Node(1, updatedBoardGameState, move, 0, aim);
  return childNode;
};

function moveAI() {
  if (currentTurn !== PLAYER_TWO) {
    return;
  }
  const now = Date.now();
  const opts = new minimaxer.NegamaxOpts();


  const allPossibleStatesAfterTurn = getGameStatesToAnalyze(
    gameBoardState,
    PLAYER_TWO
  ).keySeq().toJS()


  opts.depth = allPossibleStatesAfterTurn.length < 500 ? 2 : 1
  opts.method = 0
  opts.pruning = 1
  opts.sortMethod = 0
  opts.genBased = false
  opts.optimal = false
  console.log('DEPTH is ' + opts.depth)

  let aim = 1
  let data = 1
  let move = null
  const nodeType = 0
  const root = new minimaxer.Node(
    nodeType,
    gameBoardState,
    move,
    data,
    aim,
    allPossibleStatesAfterTurn
  );
  const tree = new minimaxer.Negamax(root, opts);

  tree.CreateChildNode = createChildCallback;
  tree.EvaluateNode = (node) => {
    let gamestateToAnalyze;


    if (!node.gamestate.gamestate) {

      gamestateToAnalyze = node.gamestate
    } else {
      gamestateToAnalyze = node.gamestate.gamestate
    }

    const scoreForNode = getGameStateScore(gamestateToAnalyze);

    return scoreForNode
  }
  tree.GetMoves = (gamestate) => {

    const gamestateToAnalyze = gamestate.gamestate

    // console.log(gamestateToAnalyze)

    // Store the turn on the gamestate...
    return getGameStatesToAnalyze(
      gamestateToAnalyze,
      PLAYER_ONE
    ).keySeq().toJS()
  };

  const result = tree.evaluate();
  console.log(`nodes: ${result.nodes}`)
  console.log(`outcomes: ${result.outcomes}`)
  const elapsed = Date.now() - now;
  console.log("Took %d ms", elapsed);
  playMove(result.move);
}

function applyMoveToGameState(gamestate: any, move: string) {

  if (!gamestate) {
    debugger
  }
  // Single move only
  if (move.indexOf("=>") === -1) {
    const [firstFromCoordinate, firstToCoordinate] = move.split("->");
    const fromPiece = gamestate.get(firstFromCoordinate);
    return gamestate.set(firstFromCoordinate, false).set(firstToCoordinate, fromPiece)
  }

  const [firstMove, secondMove] = move.split("=>");
  const [firstFromCoordinate, firstToCoordinate] = firstMove.split("->");
  const [secondFromCoordinate, secondToCoordinate] = secondMove.split("->");
  const fromPiece = gamestate.get(firstFromCoordinate);

  // dont render moving piece in the same spot...
  let updatedBoardGameState = gamestate.set(firstFromCoordinate, false)

  updatedBoardGameState = (updatedBoardGameState.set(firstToCoordinate, fromPiece));


  const secondFromPiece = updatedBoardGameState.get(secondFromCoordinate);
  updatedBoardGameState = (updatedBoardGameState.set(secondFromCoordinate, false));


  const toPiece = updatedBoardGameState.get(secondToCoordinate);

  if (secondFromPiece.ownedBy === toPiece.ownedBy) {
    updatedBoardGameState = (
      updatedBoardGameState
        .set(secondToCoordinate, secondFromPiece)
        .setIn(
          [secondToCoordinate, "stackSize"],
          secondFromPiece.stackSize + toPiece.stackSize
        )
    );
  } else {
    updatedBoardGameState = (
      updatedBoardGameState.set(secondToCoordinate, secondFromPiece)
    );
  }


  return updatedBoardGameState
}


function playMove(move) {
  if (currentTurn !== PLAYER_TWO) {
    return;
  }

  // const bestMove = getBestMove(gameBoardState, PLAYER_TWO);

  // Single move only
  if (move.indexOf("=>") === -1) {
    const [firstFromCoordinate, firstToCoordinate] = move.split("->");
    const fromPiece = gameBoardState.get(firstFromCoordinate);
    setNewgameBoardState(gameBoardState.set(firstFromCoordinate, false));
    const fromFirstPixelCoodinate = getPixelCoordinatesFromBoardCoordinates(
      firstFromCoordinate
    );
    const toFirstPixelCoordinate = getPixelCoordinatesFromBoardCoordinates(
      firstToCoordinate
    );

    DEBUG &&
      console.log(`MOVING FROM ${firstFromCoordinate} TO ${firstToCoordinate}`);
    renderMovingPiece(
      fromPiece,
      fromFirstPixelCoodinate,
      toFirstPixelCoordinate,
      2000,
      Date.now(),
      () => {
        setNewgameBoardState(gameBoardState.set(firstToCoordinate, fromPiece));

        checkGameStateAndStartNextTurn();
        checkGameStateAndStartNextTurn();
        drawGameBoardState();
      }
    );
    return;
  }

  const [firstMove, secondMove] = move.split("=>");
  const [firstFromCoordinate, firstToCoordinate] = firstMove.split("->");
  const [secondFromCoordinate, secondToCoordinate] = secondMove.split("->");
  const fromPiece = gameBoardState.get(firstFromCoordinate);

  // dont render moving piece in the same spot...
  setNewgameBoardState(gameBoardState.set(firstFromCoordinate, false));
  const fromFirstPixelCoodinate = getPixelCoordinatesFromBoardCoordinates(
    firstFromCoordinate
  );
  const toFirstPixelCoordinate = getPixelCoordinatesFromBoardCoordinates(
    firstToCoordinate
  );

  const fromSecondPixelCoodinate = getPixelCoordinatesFromBoardCoordinates(
    secondFromCoordinate
  );
  const toSecondPixelCoordinate = getPixelCoordinatesFromBoardCoordinates(
    secondToCoordinate
  );

  DEBUG &&
    console.log(`MOVING FROM ${firstFromCoordinate} TO ${firstToCoordinate}`);

  renderMovingPiece(
    fromPiece,
    fromFirstPixelCoodinate,
    toFirstPixelCoordinate,
    2000,
    Date.now(),
    () => {
      setNewgameBoardState(gameBoardState.set(firstToCoordinate, fromPiece));

      nextPhase();

      const secondFromPiece = gameBoardState.get(secondFromCoordinate);
      setNewgameBoardState(gameBoardState.set(secondFromCoordinate, false));

      DEBUG &&
        console.log(
          `MOVING FROM ${secondFromCoordinate} TO ${secondToCoordinate}`
        );

      renderMovingPiece(
        secondFromPiece,
        fromSecondPixelCoodinate,
        toSecondPixelCoordinate,
        2000,
        Date.now(),
        () => {
          const toPiece = gameBoardState.get(secondToCoordinate);

          if (secondFromPiece.ownedBy === toPiece.ownedBy) {
            setNewgameBoardState(
              gameBoardState
                .set(secondToCoordinate, secondFromPiece)
                .setIn(
                  [secondToCoordinate, "stackSize"],
                  secondFromPiece.stackSize + toPiece.stackSize
                )
            );
          } else {
            setNewgameBoardState(
              gameBoardState.set(secondToCoordinate, secondFromPiece)
            );
          }

          checkGameStateAndStartNextTurn();
          drawGameBoardState();
        }
      );
    }
  );
}

function getBestMove(gameState, turn) {
  DEBUG && console.time("all game states");
  debugger;

  const allPossibleStatesAfterTurn = getGameStatesToAnalyze(gameState, turn);
  // console.log(allPossibleStatesAfterTurn.toJS());

  let depth = 1;

  if (allPossibleStatesAfterTurn.size < 500) {
    depth = 2;
  }

  if (allPossibleStatesAfterTurn.size < 150) {
    depth = 3;
  }

  if (allPossibleStatesAfterTurn.size < 20) {
    depth = 4;
  }

  DEBUG && console.timeEnd("all game states");
  DEBUG &&
    console.log(
      `ALL POSSIBLE GAME STATES AT DEPTH ${depth}: ${allPossibleStatesAfterTurn.size}`
    );

  DEBUG && console.time("get scores");

  const minimaxResult = minimax(gameState, PLAYER_TWO, depth);

  const bestMove = minimaxResult[1];
  DEBUG && console.timeEnd("get scores");

  // document.getElementById("loadingSpinner").classList.add("hidden");
  return bestMove;
}

export function initGame(SETUP_STYLE: "RANDOM" | "SYMMETRIC" = "SYMMETRIC") {
  const piecesToSetup =
    SETUP_STYLE !== "RANDOM"
      ? setupBoardWithPiecesNotRandom()
      : setupBoardWithPieces();
  drawInitialGrid();
  renderInitializingBoard(piecesToSetup, () => {
    drawGameBoardState();
    drawCoordinates();
  });
}

const isMobile = "ontouchstart" in document.documentElement;
const mouseUpEvent = isMobile ? "touchend" : "mouseup";
const mouseDownEvent = isMobile ? "touchstart" : "mousedown";
const mouseMoveEvent = isMobile ? "touchmove" : "mousemove";

