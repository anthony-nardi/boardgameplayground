import {
  PLAYER_TWO,
  PLAYER_ONE,
  TURN_PHASES,
  RING_PLACEMENT,
} from "../constants";
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
  const currentPhase = GameState.getPhase();
  const isPlayerOneTurn = currentTurn === PLAYER_ONE;
  const isPlayerTwoTurn = currentTurn === PLAYER_TWO;
  const shouldMoveAI =
    (isPlayerOneTurn && GameState.getIsFirstPlayerAI()) ||
    (isPlayerTwoTurn && GameState.getIsSecondPlayerAI());

  const botMakingMove = isPlayerOneTurn ? botOne : botTwo;

  if (shouldMoveAI) {
    if (currentPhase === RING_PLACEMENT) {
      botMakingMove.moveAIRingPlacement();
    } else {
      botMakingMove.moveAIRingMovement();
    }
  }
}

export function checkGameStateAndStartNextTurn(
  shouldCheckWinner = false,
  maybeMoveAI?: Function
) {}

export function initGame(isHumanFirstPlayer: boolean) {
  if (GameState.getHasGameStarted()) {
    return;
  } else {
    GameState.setHasGameStarted();
  }

  GameState.setIsFirstPlayerAI(false);
  GameState.setIsSecondPlayerAI(true);

  if (isDebugModeOn()) {
    GameHistory.setGameId(Date.now());
  }

  drawInitialGrid();
}
