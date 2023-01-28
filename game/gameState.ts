import { List, Map } from "immutable";
import { PLAYER_ONE, PLAYER_TWO, TURN_PHASES } from "./constants";

export let movingPiece = null;
export let gameBoardState = Map();
export let isVeryFirstTurn = true;
export let currentTurn = PLAYER_ONE;
export let turnPhase = TURN_PHASES.CAPTURE;
export let numberOfTurnsIntoGame = 0;

export function setNewgameBoardState(newState) {
  gameBoardState = newState;
}

export function setMovingPiece(coordinate) {
  movingPiece = coordinate;
}

export function nextPhase() {
  // first turn of the game is special
  if (isVeryFirstTurn) {
    isVeryFirstTurn = false;
    turnPhase = TURN_PHASES.CAPTURE;
    currentTurn = PLAYER_TWO;
    numberOfTurnsIntoGame = numberOfTurnsIntoGame + 1;
    document.getElementById("phaseDiv").innerHTML = "CAPTURE";
    document.getElementById("turnDiv").innerHTML = "AI";

    return;
  }

  // players turns aren't over yet
  if (currentTurn === PLAYER_ONE && turnPhase === TURN_PHASES.CAPTURE) {
    turnPhase = TURN_PHASES.STACK_OR_CAPTURE;
    document.getElementById("phaseDiv").innerHTML = "STACK OR CAPTURE";
    return;
  }
  if (currentTurn === PLAYER_TWO && turnPhase === TURN_PHASES.CAPTURE) {
    turnPhase = TURN_PHASES.STACK_OR_CAPTURE;
    document.getElementById("phaseDiv").innerHTML = "STACK OR CAPTURE";
    return;
  }

  // next players turn begins
  if (
    currentTurn === PLAYER_ONE &&
    turnPhase === TURN_PHASES.STACK_OR_CAPTURE
  ) {
    turnPhase = TURN_PHASES.CAPTURE;
    currentTurn = PLAYER_TWO;
    numberOfTurnsIntoGame = numberOfTurnsIntoGame + 1;
    document.getElementById("phaseDiv").innerHTML = "CAPTURE";
    document.getElementById("turnDiv").innerHTML = "AI";
    return;
  }
  if (
    currentTurn === PLAYER_TWO &&
    turnPhase === TURN_PHASES.STACK_OR_CAPTURE
  ) {
    turnPhase = TURN_PHASES.CAPTURE;
    currentTurn = PLAYER_ONE;
    numberOfTurnsIntoGame = numberOfTurnsIntoGame + 1;
    document.getElementById("phaseDiv").innerHTML = "CAPTURE";
    document.getElementById("turnDiv").innerHTML = "PLAYER";
    return;
  }
}
