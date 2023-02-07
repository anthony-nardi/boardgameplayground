import { Map, RecordOf } from "immutable";
import { GamePieceRecordProps, PLAYER_ONE, PLAYER_TWO, TURN_PHASES } from "./constants";
import { ValidCoordinate } from "./tzaar/types/types";

export let movingPiece: null | ValidCoordinate = null;
export let gameBoardState = Map<ValidCoordinate, RecordOf<GamePieceRecordProps> | false>();
export let isVeryFirstTurn = true;
export let currentTurn = PLAYER_ONE;
export let turnPhase = TURN_PHASES.CAPTURE;
export let numberOfTurnsIntoGame = 0;



export function setNewgameBoardState(newState: typeof gameBoardState) {
  gameBoardState = newState;
  window.gameBoardState = gameBoardState
}

export function setMovingPiece(coordinate: ValidCoordinate | null) {
  movingPiece = coordinate;
}

export function nextPhase() {
  const skipTurnButton = document.getElementById('skipTurnButton')

  if (skipTurnButton) {
    skipTurnButton.classList.add('hidden')
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
    skipTurnButton.classList.remove('hidden')
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
