import { PLAYER_TWO, PLAYER_ONE, TURN_PHASES, CAPTURE } from "../constants";
import { drawInitialGrid } from "../rendering/cachedBoard";
import {
  drawCoordinates,
  drawGameBoardState,
  drawGamePiece,
  renderInitializingBoard,
} from "../rendering/renderHelpers";
import {
  setupSymmetricalBoard,
  getValidCaptures,
  getValidStacks,
} from "./gameBoardHelpers";
import GameState from "./gameState";
import {
  setGameId,
  addFirstHumanMoveToCurrentGame,
  addSecondHumanMoveToCurrentGame,
} from "./gameHistory";
import React from "react";
import { ValidCoordinate } from "../types/types";
import {
  getPixelCoordinatesFromUserInteraction,
  getBoardCoordinatesFromUserInteraction,
} from "../rendering/coordinateHelpers";
import { hideSkipButton, showLoadingSpinner } from "../rendering/domHelpers";
import BotFactory from "./BotFactory";
import { getWinner } from "./evaluationHelpers";
import { isDebug } from "./utils";
import EvaluationFactory from "./EvaluationFactory";
import { aiDoesntKillAgain } from "../tests/aiDoesntKill";

let botOne: undefined | BotFactory;
let botTwo: undefined | BotFactory;

let matchIndex = 0;

export function moveAI() {
  const currentTurn = GameState.getCurrentTurn();
  if (
    (currentTurn === PLAYER_ONE && !GameState.getIsFirstPlayerAI()) ||
    (currentTurn === PLAYER_TWO && !GameState.getIsSecondPlayerAI())
  ) {
    return;
  }

  if (getWinner(GameState.getGameBoardState(), true, currentTurn)) {
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
  const piece = GameState.getGameBoardState()[boardCoordinate];
  return piece && piece.ownedBy === GameState.getCurrentTurn();
}

export function passTurn() {
  const canPass =
    GameState.getCurrentTurn() === PLAYER_ONE &&
    GameState.getTurnPhase() === TURN_PHASES.STACK_OR_CAPTURE_OR_PASS;

  if (canPass) {
    GameState.nextPhase();
    hideSkipButton();
    showLoadingSpinner();
    setTimeout(moveAI);
  }
}

export function handleClickPiece(event: React.MouseEvent<HTMLCanvasElement>) {
  const currentTurn = GameState.getCurrentTurn();
  const gameBoardState = GameState.getGameBoardState();
  const boardCoordinate = getBoardCoordinatesFromUserInteraction(event);

  if (!isCurrentPlayerPiece(boardCoordinate)) {
    return;
  }

  if (currentTurn === PLAYER_TWO && GameState.getIsSecondPlayerAI()) {
    return;
  }

  if (currentTurn === PLAYER_ONE && GameState.getIsFirstPlayerAI()) {
    return;
  }

  if (getWinner(gameBoardState, true, currentTurn)) {
    return;
  }

  const piece = gameBoardState[boardCoordinate];

  if (piece) {
    piece.isDragging = true;
  }

  GameState.setMovingPiece(boardCoordinate);
}

export function handleMovePiece(event: React.MouseEvent<HTMLCanvasElement>) {
  const movingPiece = GameState.getMovingPiece();
  const currentTurn = GameState.getCurrentTurn();

  if (!movingPiece) {
    return;
  }

  if (currentTurn === PLAYER_TWO && GameState.getIsSecondPlayerAI()) {
    return;
  }

  if (currentTurn === PLAYER_ONE && GameState.getIsFirstPlayerAI()) {
    return;
  }

  const gamePiece = GameState.getGameBoardState()[movingPiece];

  if (!gamePiece) {
    throw new Error("gamepiece not here");
  }

  const [x, y] = getPixelCoordinatesFromUserInteraction(event);

  drawGameBoardState();

  drawGamePiece(gamePiece, x, y);
}

export function handleDropPiece(event: React.MouseEvent<HTMLCanvasElement>) {
  const movingPiece = GameState.getMovingPiece();
  const gameBoardState = GameState.getGameBoardState();

  if (!movingPiece) {
    return;
  }

  const toCoordinates = getBoardCoordinatesFromUserInteraction(event);

  const piece = gameBoardState[movingPiece];

  if (piece) {
    piece.isDragging = false;
  }

  if (!gameBoardState[toCoordinates]) {
    GameState.setMovingPiece(null);
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

  if (
    isValidStack &&
    GameState.getTurnPhase() === TURN_PHASES.STACK_OR_CAPTURE_OR_PASS
  ) {
    stackPiece(movingPiece, toCoordinates);
  }

  GameState.setMovingPiece(null);
  drawGameBoardState();
}

function capturePiece(
  fromCoordinates: ValidCoordinate,
  toCoordinates: ValidCoordinate
) {
  const gameBoardState = GameState.getGameBoardState();

  const fromPiece = gameBoardState[fromCoordinates];

  if (!fromPiece) {
    throw new Error("fromPiece not there.");
  }

  if (isDebug()) {
    if (GameState.getTurnPhase() === CAPTURE) {
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
  const gameBoardState = GameState.getGameBoardState();

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
  let winner;
  const gameBoardState = GameState.getGameBoardState();
  const turnPhase = GameState.getTurnPhase();
  const currentTurn = GameState.getCurrentTurn();

  GameState.nextPhase();

  if (turnPhase === TURN_PHASES.CAPTURE || shouldCheckWinner) {
    winner = getWinner(gameBoardState, true, currentTurn);
  }

  if (winner) {
    const message = GameState.getWinnerMessage(winner);
    console.log(
      message,
      `Number of turns taken: ${GameState.getNumberOfTurnsIntoGame()}`
    );
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

    const arrSeq = aiDoesntKillAgain();

    let nextPlayer = botTwo;

    function playThroughSeq() {
      nextPlayer = botTwo ? botOne : botTwo;
      const nextMove = arrSeq.shift();

      if (nextMove) {
        if (nextMove === "5,0->5,4=>5,4->5,7") {
          debugger;
          GameState.setInitialGameState(PLAYER_TWO, TURN_PHASES.CAPTURE, 15);

          botTwo?.moveAI(() => {});
          return;
        }
        console.log(nextMove);
        nextPlayer?.playMove(nextMove, playThroughSeq);
      } else {
        console.log("wat");
      }
    }
    playThroughSeq();

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
