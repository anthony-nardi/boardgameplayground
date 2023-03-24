import { PLAYER_TWO, PLAYER_ONE, TURN_PHASES } from "../constants";
import { drawInitialGrid } from "../rendering/cachedBoard";
import {
  drawCoordinates,
  drawGameBoardState,
  renderInitializingBoard,
} from "../rendering/renderHelpers";
import GameState from "./GameState";
import GameHistory from "../utils/GameHistory";
import { showLoadingSpinner } from "../rendering/domHelpers";
import BotFactory from "./BotFactory";
import { getWinner } from "./evaluationHelpers";
import { isDebugModeOn } from "./utils";

let botOne: BotFactory = new BotFactory();
let botTwo: BotFactory = new BotFactory();

export function moveAI() {
  const currentTurn = GameState.getCurrentTurn();
  const isPlayerOneTurn = currentTurn === PLAYER_ONE;
  const isPlayerTwoTurn = currentTurn === PLAYER_TWO;
  const shouldMoveAI =
    (isPlayerOneTurn && GameState.getIsFirstPlayerAI()) ||
    (isPlayerTwoTurn && GameState.getIsSecondPlayerAI());

  const isGameOver = getWinner(
    GameState.getGameBoardState(),
    true,
    currentTurn
  );

  if (!shouldMoveAI || isGameOver) {
    return;
  }

  showLoadingSpinner();

  const botMakingMove = isPlayerOneTurn ? botOne : botTwo;

  setTimeout(() => {
    botMakingMove.moveAI(moveAI);
  }, 200);
}

export function checkGameStateAndStartNextTurn(
  shouldCheckWinner = false,
  maybeMoveAI?: Function
) {
  // let winner;
  // const gameBoardState = GameState.getGameBoardState();
  // const turnPhase = GameState.getPhase();
  // const currentTurn = GameState.getCurrentTurn();
  // if (turnPhase === TURN_PHASES.CAPTURE || shouldCheckWinner) {
  //   winner = getWinner(gameBoardState, true, currentTurn);
  // }
  // if (winner) {
  //   const message = GameState.getWinnerMessage(winner);
  //   console.log(
  //     message,
  //     `Number of turns taken: ${GameState.getNumberOfTurnsIntoGame()}`
  //   );
  //   const winnerElement = document.getElementById("winnerMessage");
  //   if (winnerElement && message) {
  //     winnerElement.innerHTML = message;
  //   }
  // }
  // maybeMoveAI && setTimeout(maybeMoveAI);
}

export function initGame(isHumanFirstPlayer: boolean) {
  if (GameState.getHasGameStarted()) {
    return;
  } else {
    GameState.setHasGameStarted();
  }

  GameState.setIsFirstPlayerAI(false);
  GameState.setIsSecondPlayerAI(false);
  // if (isHumanFirstPlayer) {
  //   GameState.setIsFirstPlayerAI(false);
  //   GameState.setIsSecondPlayerAI(true);
  // } else {
  //   GameState.setIsFirstPlayerAI(true);
  //   GameState.setIsSecondPlayerAI(false);
  // }

  if (isDebugModeOn()) {
    GameHistory.setGameId(Date.now());
  }

  // const piecesToSetup = setupSymmetricalBoard();

  drawInitialGrid();
  // drawGameBoardState();
  // drawCoordinates();

  // renderInitializingBoard(piecesToSetup, () => {
  // drawGameBoardState();

  // setTimeout(moveAI);

  //   if (isDebugModeOn()) {
  //     drawCoordinates();
  //   }
  // });
}
