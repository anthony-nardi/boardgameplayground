import { PLAYER_TWO, PLAYER_ONE, TURN_PHASES } from "./constants";
import { drawInitialGrid } from "./cachedBoard";
import {
  drawCoordinates,
  drawGameBoardState,
  drawGamePiece,
  renderInitializingBoard,
} from "./renderHelpers";
import {
  setupSymmetricalBoard,
  setupRandomBoard,
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
  isSecondPlayerAI,
  isFirstPlayerAI,
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

let botOne: undefined | BotFactory
let botTwo: undefined | BotFactory

let matchIndex = 0

function moveAI() {
  if (
    (currentTurn === PLAYER_ONE && !isFirstPlayerAI) ||
    (currentTurn === PLAYER_TWO && !isSecondPlayerAI)
  ) {
    return;
  }

  if (currentTurn === PLAYER_ONE) {
    botOne?.moveAI(moveAI);
  }
  if (currentTurn === PLAYER_TWO) {
    botTwo?.moveAI(moveAI);
  }
}

function isCurrentPlayerPiece(boardCoordinate: ValidCoordinate) {
  return gameBoardState.getIn([boardCoordinate, "ownedBy"]) === currentTurn;
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

  setNewgameBoardState(
    gameBoardState.setIn([boardCoordinate, "isDragging"], true)
  );

  setMovingPiece(boardCoordinate);
}

export function handleMovePiece(event: React.MouseEvent<HTMLCanvasElement>) {
  if (!movingPiece) {
    return;
  }

  const gamePiece = gameBoardState.get(movingPiece);

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
  const fromPiece = gameBoardState.get(fromCoordinates);

  if (!fromPiece) {
    throw new Error("fromPiece not there.");
  }

  setNewgameBoardState(
    gameBoardState.set(fromCoordinates, false).set(toCoordinates, fromPiece)
  );
  checkGameStateAndStartNextTurn(true);
}

function stackPiece(
  fromCoordinates: ValidCoordinate,
  toCoordinates: ValidCoordinate
) {
  const fromPiece = gameBoardState.get(fromCoordinates);
  const toPiece = gameBoardState.get(toCoordinates);

  if (!fromPiece || !toPiece) {
    throw new Error("Stacking broken");
  }

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

export function checkGameStateAndStartNextTurn(shouldCheckWinner = false) {
  nextPhase();
  let winner;

  if (turnPhase === TURN_PHASES.CAPTURE || shouldCheckWinner) {
    winner = getWinner(gameBoardState, true);
  }

  let message = winner === PLAYER_TWO ? "You lost." : "You won!";
  if (winner) {
    console.log("WINNER ", winner, message);
    // @ts-expect-error fix
    const matchesToPlay = setupSurvivalOfTheFittest()

    if (matchIndex < Object.keys(matchesToPlay).length) {
      matchIndex += 1
      initGame()
    }

  }
}

export function initGame(SETUP_STYLE: "RANDOM" | "SYMMETRIC" = "SYMMETRIC") {
  const piecesToSetup =
    SETUP_STYLE !== "RANDOM" ? setupSymmetricalBoard() : setupRandomBoard();

  drawInitialGrid();


  const matchesToPlay = setupSurvivalOfTheFittest(2)

  const matchToPlay = Object.keys(matchesToPlay)[matchIndex]

  const botOneName = matchToPlay.split('|')[0]
  const botTwoName = matchToPlay.split('|')[1]

  // @ts-expect-error fix
  const botOneParameters = matchesToPlay[matchToPlay][botOneName]
  // @ts-expect-error fix
  const botTwoParameters = matchesToPlay[matchToPlay][botTwoName]
  botOne = new BotFactory({
    VERSION: 1,
    EDGE_PENALTY: 1,
    CORNER_PENALTY: 2,
    LARGEST_STACK_BONUS: 1000,
    STACK_VALUE_BONUS: 15,
    COUNT_SCORE_MULTIPLIER: 0,
    STACK_SIZE_SCORE_MULTIPLIER: 0,
    STACK_VALUE_BONUS_MULTIPLIER: 1,
    SCORE_FOR_STACKS_THREATENED_MULTIPLIER: 0
  })
  botTwo = new BotFactory({
    VERSION: 2,
    EDGE_PENALTY: 1,
    CORNER_PENALTY: 2,
    LARGEST_STACK_BONUS: 0,
    STACK_VALUE_BONUS: 15,
    COUNT_SCORE_MULTIPLIER: 0,
    STACK_SIZE_SCORE_MULTIPLIER: 1,
    STACK_VALUE_BONUS_MULTIPLIER: 1,
    SCORE_FOR_STACKS_THREATENED_MULTIPLIER: 1
  })

  console.log(`${botOneName} VERSUS ${botTwoName}`)
  console.log(`Bot one weights: `, botOneParameters)
  console.log(`Bot two weights`, botTwoParameters)


  renderInitializingBoard(piecesToSetup, () => {
    drawGameBoardState();

    moveAI()

    if (
      window.localStorage &&
      window.localStorage.getItem("DEBUG_TZAAR") === "true"
    ) {
      drawCoordinates();
    }
  });
}
function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}
function setupSurvivalOfTheFittest(numberOfBots: number) {

  const matches = {}

  for (let i = 1; i <= numberOfBots; i++) {
    for (let k = 1; k <= numberOfBots; k++) {
      if (i !== k) {
        const firstBotName = `BOT_${i}`
        const secondBotName = `BOT_${k}`
        const matchKey = `${firstBotName}|${secondBotName}`
        const inverseKey = `${secondBotName}|${firstBotName}`

        // @ts-expect-error fix
        if (!matches[inverseKey]) {
          // @ts-expect-error fix
          matches[matchKey] = {
            winner: 'N/A',
            [firstBotName]: {
              EDGE_PENALTY: randomNumber(1, 20),
              CORNER_PENALTY: randomNumber(1, 40),
              LARGEST_STACK_BONUS: randomNumber(1, 100)

            },
            [secondBotName]: {

              EDGE_PENALTY: randomNumber(1, 20),
              CORNER_PENALTY: randomNumber(1, 40),
              LARGEST_STACK_BONUS: randomNumber(1, 100)
            }

          }
        }
      }
    }
  }

  console.log(matches)
  return matches
}