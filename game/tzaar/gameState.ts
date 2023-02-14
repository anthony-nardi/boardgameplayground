import { Map, RecordOf } from "immutable";
import {
  GamePieceRecordProps,
  PLAYER_ONE,
  PLAYER_TWO,
  TURN_PHASES,
} from "./constants";
import { ValidCoordinate } from "./types/types";

export let movingPiece: null | ValidCoordinate = null;
export let gameBoardState = Map<
  ValidCoordinate,
  RecordOf<GamePieceRecordProps> | false
>();
export let isVeryFirstTurn = true;
export let currentTurn = PLAYER_ONE;
export let turnPhase = TURN_PHASES.CAPTURE;
export let numberOfTurnsIntoGame = 0;

export function logGameState() {
  console.log(
    `gameBoardState: ${gameBoardState.toJS()}`,
    `currentTurn: ${currentTurn}`,
    `turnPhase: ${turnPhase}`,
    `numberOfTurnsIntoGame: ${numberOfTurnsIntoGame}`
  );
}

export function setInitialGameState(
  board: typeof gameBoardState,
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

// export function checkGameStateAndStartNextTurn(shouldCheckWinner = false) {
//   nextPhase();
//   let winner;

//   if (turnPhase === TURN_PHASES.CAPTURE || shouldCheckWinner) {
//     winner = evaluation.getWinner(gameBoardState, true);
//   }

//   let message = winner === PLAYER_TWO ? "You lost." : "You won!";
//   if (winner) {
//     alert(`${message}`);
//     location.reload();
//   }
// }
