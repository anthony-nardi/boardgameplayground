import {
  PLAYER_ONE,
  PLAYER_TWO,
  TURN_PHASES,
  CAPTURE,
  STACK_OR_CAPTURE_OR_PASS,
  GameBoardRecord,
} from "./constants";
import { Player, ValidCoordinate } from "./types/types";

export let movingPiece: null | ValidCoordinate = null;
export let gameBoardState: { [K in ValidCoordinate]: any } = {
  "4,0": false,
  "5,0": false,
  "6,0": false,
  "7,0": false,
  "8,0": false,
  "3,1": false,
  "4,1": false,
  "5,1": false,
  "6,1": false,
  "7,1": false,
  "8,1": false,
  "2,2": false,
  "3,2": false,
  "4,2": false,
  "5,2": false,
  "6,2": false,
  "7,2": false,
  "8,2": false,
  "1,3": false,
  "2,3": false,
  "3,3": false,
  "4,3": false,
  "5,3": false,
  "6,3": false,
  "7,3": false,
  "8,3": false,
  "0,4": false,
  "1,4": false,
  "2,4": false,
  "3,4": false,
  "5,4": false,
  "6,4": false,
  "7,4": false,
  "8,4": false,
  "0,5": false,
  "1,5": false,
  "2,5": false,
  "3,5": false,
  "4,5": false,
  "5,5": false,
  "6,5": false,
  "7,5": false,
  "0,6": false,
  "1,6": false,
  "2,6": false,
  "3,6": false,
  "4,6": false,
  "5,6": false,
  "6,6": false,
  "0,7": false,
  "1,7": false,
  "2,7": false,
  "3,7": false,
  "4,7": false,
  "5,7": false,
  "0,8": false,
  "1,8": false,
  "2,8": false,
  "3,8": false,
  "4,8": false,
}
export let isVeryFirstTurn = true;
export let currentTurn: Player = PLAYER_ONE;
export let turnPhase: typeof CAPTURE | typeof STACK_OR_CAPTURE_OR_PASS =
  TURN_PHASES.CAPTURE;
export let numberOfTurnsIntoGame = 0;
export let isFirstPlayerAI = true;
export let isSecondPlayerAI = true;

export function logGameState() {
  console.log(
    `currentTurn: ${currentTurn}`,
    `turnPhase: ${turnPhase}`,
    `numberOfTurnsIntoGame: ${numberOfTurnsIntoGame}`
  );
}

export function setInitialGameState(
  board: typeof gameBoardState | null,
  turn: typeof PLAYER_ONE | typeof PLAYER_TWO = PLAYER_ONE,
  phase:
    | typeof TURN_PHASES.CAPTURE
    | typeof TURN_PHASES.STACK_OR_CAPTURE_OR_PASS = TURN_PHASES.CAPTURE,
  numberOfTurns: number = 0
) {
  if (board) {
    setNewgameBoardState(board);
  }
  currentTurn = turn;
  turnPhase = phase;
  numberOfTurnsIntoGame = numberOfTurns;
  isVeryFirstTurn = numberOfTurns === 0;
}

export function setNewgameBoardState(newState: typeof gameBoardState) {
  gameBoardState = newState;
  window.gameBoardState = gameBoardState;
}

export function setMovingPiece(coordinate: ValidCoordinate | null) {
  movingPiece = coordinate;
}

export function nextPhase() {
  const skipTurnButton = document.getElementById("skipTurnButton");

  if (skipTurnButton) {
    skipTurnButton.classList.add("hidden");
  }

  // first turn of the game is special
  if (isVeryFirstTurn) {
    isVeryFirstTurn = false;
    turnPhase = TURN_PHASES.CAPTURE;
    currentTurn = PLAYER_TWO;
    numberOfTurnsIntoGame = numberOfTurnsIntoGame + 1;
    // @ts-expect-error todo
    document.getElementById("phaseDiv").innerHTML = "Phase: CAPTURE";
    // @ts-expect-error todo
    document.getElementById("turnDiv").innerHTML = "Turn: AI";

    return;
  }

  // players turns aren't over yet
  if (currentTurn === PLAYER_ONE && turnPhase === TURN_PHASES.CAPTURE) {
    turnPhase = TURN_PHASES.STACK_OR_CAPTURE_OR_PASS;
    // @ts-expect-error todo
    document.getElementById("phaseDiv").innerHTML = "Phase: STACK OR CAPTURE";
    // @ts-expect-error todo
    skipTurnButton.classList.remove("hidden");
    return;
  }
  if (currentTurn === PLAYER_TWO && turnPhase === TURN_PHASES.CAPTURE) {
    turnPhase = TURN_PHASES.STACK_OR_CAPTURE_OR_PASS;
    // @ts-expect-error todo
    document.getElementById("phaseDiv").innerHTML = "Phase: STACK OR CAPTURE";
    return;
  }

  // next players turn begins
  if (
    currentTurn === PLAYER_ONE &&
    turnPhase === TURN_PHASES.STACK_OR_CAPTURE_OR_PASS
  ) {
    turnPhase = TURN_PHASES.CAPTURE;
    currentTurn = PLAYER_TWO;
    numberOfTurnsIntoGame = numberOfTurnsIntoGame + 1;
    // @ts-expect-error todo
    document.getElementById("phaseDiv").innerHTML = "Phase: CAPTURE";
    // @ts-expect-error todo
    document.getElementById("turnDiv").innerHTML = "Turn: AI";
    return;
  }
  if (
    currentTurn === PLAYER_TWO &&
    turnPhase === TURN_PHASES.STACK_OR_CAPTURE_OR_PASS
  ) {
    turnPhase = TURN_PHASES.CAPTURE;
    currentTurn = PLAYER_ONE;
    numberOfTurnsIntoGame = numberOfTurnsIntoGame + 1;
    // @ts-expect-error todo
    document.getElementById("phaseDiv").innerHTML = "Phase: CAPTURE";
    // @ts-expect-error todo
    document.getElementById("turnDiv").innerHTML = "Turn: PLAYER";
    return;
  }
}
