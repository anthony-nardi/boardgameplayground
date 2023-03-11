import { PLAYER_TWO, PLAYER_ONE, TURN_PHASES, CAPTURE } from "./constants";
import { drawInitialGrid } from "./cachedBoard";
import {
  drawCoordinates,
  drawGameBoardState,
  drawGamePiece,
  renderInitializingBoard,
} from "./renderHelpers";
import {
  setupSymmetricalBoard,
  getValidCaptures,
  getValidStacks,
} from "./gameBoardHelpers";
import {
  movingPiece,
  gameBoardState,
  setMovingPiece,
  nextPhase,
  currentTurn,
  turnPhase,
  isSecondPlayerAI,
  isFirstPlayerAI,
  numberOfTurnsIntoGame,
  getWinnerMessage,
  setInitialGameState,
  game_id,
  setGameId,
  addFirstHumanMoveToCurrentGame,
  addSecondHumanMoveToCurrentGame,
} from "./gameState";
import React from "react";
import { ValidCoordinate } from "./types/types";
import {
  getPixelCoordinatesFromUserInteraction,
  getBoardCoordinatesFromUserInteraction,
} from "./coordinateHelpers";
import { hideSkipButton, showLoadingSpinner } from "./domHelpers";
import BotFactory from "./BotFactory";
import { getWinner } from "./evaluationHelpers";
import { isDebug } from "./utils";
import EvaluationFactory from "./EvaluationFactory";
import { aiDoesntKill } from "./tests/aiDoesntKill";

let botOne: undefined | BotFactory;
let botTwo: undefined | BotFactory;

let matchIndex = 0;

export function moveAI() {
  if (
    (currentTurn === PLAYER_ONE && !isFirstPlayerAI) ||
    (currentTurn === PLAYER_TWO && !isSecondPlayerAI)
  ) {
    return;
  }

  if (getWinner(gameBoardState, true, currentTurn)) {
    return null;
  }

  showLoadingSpinner();

  if (currentTurn === PLAYER_ONE) {
    setTimeout(() => {
      botOne?.moveAI(moveAI);
    }, 200);
  }
  if (currentTurn === PLAYER_TWO) {
    setTimeout(() => {
      botTwo?.moveAI(moveAI);
    }, 200);
  }
}

function isCurrentPlayerPiece(boardCoordinate: ValidCoordinate) {
  const piece = gameBoardState[boardCoordinate];
  return piece && piece.ownedBy === currentTurn;
}

export function passTurn() {
  const canPass =
    currentTurn === PLAYER_ONE &&
    turnPhase === TURN_PHASES.STACK_OR_CAPTURE_OR_PASS;

  if (canPass) {
    nextPhase();
    hideSkipButton();
    showLoadingSpinner();
    setTimeout(moveAI);
  }
}

export function handleClickPiece(event: React.MouseEvent<HTMLCanvasElement>) {
  const boardCoordinate = getBoardCoordinatesFromUserInteraction(event);

  if (!isCurrentPlayerPiece(boardCoordinate)) {
    return;
  }

  if (currentTurn === PLAYER_TWO && isSecondPlayerAI) {
    return;
  }

  if (currentTurn === PLAYER_ONE && isFirstPlayerAI) {
    return;
  }

  if (getWinner(gameBoardState, true, currentTurn)) {
    return;
  }

  const piece = gameBoardState[boardCoordinate];

  if (piece) {
    piece.isDragging = true;
  }

  setMovingPiece(boardCoordinate);
}

export function handleMovePiece(event: React.MouseEvent<HTMLCanvasElement>) {
  if (!movingPiece) {
    return;
  }

  if (currentTurn === PLAYER_TWO && isSecondPlayerAI) {
    return;
  }

  if (currentTurn === PLAYER_ONE && isFirstPlayerAI) {
    return;
  }

  const gamePiece = gameBoardState[movingPiece];

  if (!gamePiece) {
    throw new Error("gamepiece not here");
  }

  const [x, y] = getPixelCoordinatesFromUserInteraction(event);

  drawGameBoardState();

  drawGamePiece(gamePiece, x, y);
}

export function handleDropPiece(event: React.MouseEvent<HTMLCanvasElement>) {
  if (!movingPiece) {
    return;
  }

  const toCoordinates = getBoardCoordinatesFromUserInteraction(event);

  const piece = gameBoardState[movingPiece];

  if (piece) {
    piece.isDragging = false;
  }

  if (!gameBoardState[toCoordinates]) {
    setMovingPiece(null);
    drawGameBoardState();
    return;
  }

  const validCaptures = getValidCaptures(movingPiece, gameBoardState);
  const validStacks = getValidStacks(movingPiece, gameBoardState);
  const isValidCapture = validCaptures.includes(toCoordinates);
  const isValidStack = validStacks.includes(toCoordinates);

  if (isValidCapture) {
    capturePiece(movingPiece, toCoordinates);
  }

  if (isValidStack && turnPhase === TURN_PHASES.STACK_OR_CAPTURE_OR_PASS) {
    stackPiece(movingPiece, toCoordinates);
  }

  setMovingPiece(null);
  drawGameBoardState();
}

function capturePiece(
  fromCoordinates: ValidCoordinate,
  toCoordinates: ValidCoordinate
) {
  const fromPiece = gameBoardState[fromCoordinates];

  if (!fromPiece) {
    throw new Error("fromPiece not there.");
  }

  if (isDebug()) {
    if (turnPhase === CAPTURE) {
      addFirstHumanMoveToCurrentGame(`${fromCoordinates}->${toCoordinates}`);
    } else {
      addSecondHumanMoveToCurrentGame(`${fromCoordinates}->${toCoordinates}`);
    }
  }

  gameBoardState[fromCoordinates] = false;
  gameBoardState[toCoordinates] = fromPiece;

  checkGameStateAndStartNextTurn(true, moveAI);
}

function stackPiece(
  fromCoordinates: ValidCoordinate,
  toCoordinates: ValidCoordinate
) {
  const fromPiece = gameBoardState[fromCoordinates];
  const toPiece = gameBoardState[toCoordinates];

  if (!fromPiece || !toPiece) {
    throw new Error("Stacking broken");
  }

  if (isDebug()) {
    addSecondHumanMoveToCurrentGame(`${fromCoordinates}->${toCoordinates}`);
  }

  gameBoardState[fromCoordinates] = false;
  gameBoardState[toCoordinates] = fromPiece;
  fromPiece.stackSize = fromPiece.stackSize + toPiece.stackSize;

  checkGameStateAndStartNextTurn(false, moveAI);
}

export function checkGameStateAndStartNextTurn(
  shouldCheckWinner = false,
  maybeMoveAI?: Function
) {
  nextPhase();
  let winner;

  if (turnPhase === TURN_PHASES.CAPTURE || shouldCheckWinner) {
    winner = getWinner(gameBoardState, true, currentTurn);
  }

  if (winner) {
    const message = getWinnerMessage(winner);

    console.log(message, `Number of turns taken: ${numberOfTurnsIntoGame}`);
    // @ts-expect-error fix
    const matchesToPlay = setupSurvivalOfTheFittest();

    if (matchIndex < Object.keys(matchesToPlay).length) {
      matchIndex += 1;
      initGame();
    } else {
      alert(message);
    }
  }

  maybeMoveAI && setTimeout(maybeMoveAI);
}

export function initGame() {
  if (isDebug()) {
    setGameId(Date.now());
  }

  const piecesToSetup = setupSymmetricalBoard();
  // const piecesToSetup = aiDoesntKill();
  drawInitialGrid();

  const matchesToPlay = setupSurvivalOfTheFittest(2);

  const matchToPlay = Object.keys(matchesToPlay)[matchIndex];

  const botOneName = matchToPlay.split("|")[0];
  const botTwoName = matchToPlay.split("|")[1];

  // @ts-expect-error fix
  const botOneParameters = matchesToPlay[matchToPlay][botOneName];
  // @ts-expect-error fix
  const botTwoParameters = matchesToPlay[matchToPlay][botTwoName];
  botTwo = new BotFactory({
    VERSION: 1,
    CORNER_PENALTY_MULTIPLIER: 1,
    COUNT_SCORE_MULTIPLIER: 1,
    EDGE_PENALTY_MULTIPLIER: 1,
    LARGEST_STACK_BONUS_MULTIPLIER: 1,
    SCORE_FOR_STACKS_THREATENED_MULTIPLIER: 1,
    STACK_SIZE_SCORE_MULTIPLIER: 1,
    STACK_VALUE_BONUS_MULTIPLIER: 1,
  });
  botOne = new BotFactory({
    VERSION: 2,
    CORNER_PENALTY_MULTIPLIER: 1,
    COUNT_SCORE_MULTIPLIER: 1,
    EDGE_PENALTY_MULTIPLIER: 1,
    LARGEST_STACK_BONUS_MULTIPLIER: 1,
    SCORE_FOR_STACKS_THREATENED_MULTIPLIER: 1,
    STACK_SIZE_SCORE_MULTIPLIER: 1,
    STACK_VALUE_BONUS_MULTIPLIER: 1,
  });

  console.log(`${botOneName} VERSUS ${botTwoName}`);
  console.log(`Bot one weights: `, botOneParameters);
  console.log(`Bot two weights`, botTwoParameters);

  renderInitializingBoard(piecesToSetup, () => {
    // setInitialGameState(null, PLAYER_ONE, TURN_PHASES.CAPTURE, 15);

    drawGameBoardState();

    const iterations = 1000000;

    console.time(`getGameStateScore iterations: ${iterations}`);
    const evalThing = new EvaluationFactory({
      CORNER_PENALTY_MULTIPLIER: 1,
      COUNT_SCORE_MULTIPLIER: 1,
      EDGE_PENALTY_MULTIPLIER: 1,
      LARGEST_STACK_BONUS_MULTIPLIER: 1,
      SCORE_FOR_STACKS_THREATENED_MULTIPLIER: 1,
      STACK_SIZE_SCORE_MULTIPLIER: 1,
      STACK_VALUE_BONUS_MULTIPLIER: 1,
      VERSION: 1,
    });
    for (let i = 0; i < iterations; i++) {
      // evalThing.getGameStateMetadata(gameBoardState);
      // getHasAllThreePieceTypes(gameBoardState); //1000000  800ms (now 430ms)
      // getWinner(gameBoardState) // 3.8s per mil
      // botOne?.evaluation?.getGameStateScore(
      //   gameBoardState,
      //   PLAYER_TWO,
      // ); // 9036.78125 ms per mil
      // getPossibleMoveSequences(gameBoardState, PLAYER_TWO); //1k 4801.859130859375 ms
      // applyMoveToGameState(gameBoardState, "5,7->4,7=>5,6->4,7"); // 1000000 1.931s
      // isAnyPieceCapturable(gameBoardState, PLAYER_ONE); // 10000000 3s
      // let moves = getEarlyGameMoveSequences(gameBoardState, PLAYER_ONE)
      // console.log(Object.keys(moves).length)
    }
    console.timeEnd(`getGameStateScore iterations: ${iterations}`);

    setTimeout(moveAI);

    if (isDebug()) {
      drawCoordinates();
    }
  });
}
function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}
function setupSurvivalOfTheFittest(numberOfBots: number) {
  const matches = {};

  for (let i = 1; i <= numberOfBots; i++) {
    for (let k = 1; k <= numberOfBots; k++) {
      if (i !== k) {
        const firstBotName = `BOT_${i}`;
        const secondBotName = `BOT_${k}`;
        const matchKey = `${firstBotName}|${secondBotName}`;
        const inverseKey = `${secondBotName}|${firstBotName}`;

        // @ts-expect-error fix
        if (!matches[inverseKey]) {
          // @ts-expect-error fix
          matches[matchKey] = {
            winner: "N/A",
            [firstBotName]: {
              EDGE_PENALTY: randomNumber(1, 20),
              CORNER_PENALTY: randomNumber(1, 40),
              LARGEST_STACK_BONUS: randomNumber(1, 100),
            },
            [secondBotName]: {
              EDGE_PENALTY: randomNumber(1, 20),
              CORNER_PENALTY: randomNumber(1, 40),
              LARGEST_STACK_BONUS: randomNumber(1, 100),
            },
          };
        }
      }
    }
  }

  console.log(matches);
  return matches;
}
