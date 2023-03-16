import { PLAYER_TWO, PLAYER_ONE, TURN_PHASES, CAPTURE } from "../constants";
import { drawInitialGrid } from "../rendering/cachedBoard";
import {
  drawCoordinates,
  drawGameBoardState,
  renderInitializingBoard,
} from "../rendering/renderHelpers";
import { setupSymmetricalBoard } from "./gameBoardHelpers";
import GameState from "./gameState";
import { setGameId } from "./GameHistory";
import { showLoadingSpinner } from "../rendering/domHelpers";
import BotFactory from "./BotFactory";
import { getWinner } from "./evaluationHelpers";
import { isDebugModeOn } from "./utils";
import EvaluationFactory from "./EvaluationFactory";

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
  if (isDebugModeOn()) {
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

    const iterations = 1000;

    console.time(`getPossibleMoveSequences iterations: ${iterations}`);
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
      // getPossibleMoveSequences(
      //   GameState.getGameBoardState(),
      //   PLAYER_TWO,
      //   true,
      //   true,
      //   false
      // ); //1k 4801.859130859375 ms -> 1700ms
      // applyMoveToGameState(gameBoardState, "5,7->4,7=>5,6->4,7"); // 1000000 1.931s
      // isAnyPieceCapturable(gameBoardState, PLAYER_ONE); // 10000000 3s
      // let moves = getEarlyGameMoveSequences(gameBoardState, PLAYER_ONE)
      // console.log(Object.keys(moves).length)
    }
    console.timeEnd(`getPossibleMoveSequences iterations: ${iterations}`);
    console.time(`getEarlyGameMoveSequences iterations: ${iterations}`);

    for (let i = 0; i < iterations; i++) {
      // evalThing.getGameStateMetadata(gameBoardState);
      // getHasAllThreePieceTypes(gameBoardState); //1000000  800ms (now 430ms)
      // getWinner(gameBoardState) // 3.8s per mil
      // botOne?.evaluation?.getGameStateScore(
      //   gameBoardState,
      //   PLAYER_TWO,
      // ); // 9036.78125 ms per mil
      // getEarlyGameMoveSequences(
      //   GameState.getGameBoardState(),
      //   PLAYER_TWO,
      //   TZAAR
      // ).concat(
      //   getEarlyGameMoveSequences(
      //     GameState.getGameBoardState(),
      //     PLAYER_TWO,
      //     TZARRA
      //   )
      // ); // 1k 450ms
      // applyMoveToGameState(gameBoardState, "5,7->4,7=>5,6->4,7"); // 1000000 1.931s
      // isAnyPieceCapturable(gameBoardState, PLAYER_ONE); // 10000000 3s
      // let moves = getEarlyGameMoveSequences(gameBoardState, PLAYER_ONE)
      // console.log(Object.keys(moves).length)
    }
    console.timeEnd(`getEarlyGameMoveSequences iterations: ${iterations}`);

    setTimeout(moveAI);

    if (isDebugModeOn()) {
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
