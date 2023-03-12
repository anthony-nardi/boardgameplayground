import {
  PLAYER_ONE,
  PLAYER_TWO,
  TURN_PHASES,
  CAPTURE,
  STACK_OR_CAPTURE_OR_PASS,
} from "./constants";
import { Player, PlayerPieces, ValidCoordinate } from "./types/types";

export type PieceState = {
  isDragging: boolean;
  ownedBy: Player;
  stackSize: number;
  type: PlayerPieces;
};

export type GameBoardState = {
  [K in ValidCoordinate]: false | PieceState;
};

class GameState {
  private isVeryFirstTurn = true;
  private currentTurn: Player = PLAYER_ONE;
  private turnPhase: typeof CAPTURE | typeof STACK_OR_CAPTURE_OR_PASS =
    TURN_PHASES.CAPTURE;
  private numberOfTurnsIntoGame = 0;
  private isFirstPlayerAI = false;
  private isSecondPlayerAI = true;
  private movingPiece: null | ValidCoordinate = null;
  private gameBoardState: GameBoardState = {
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
  };
  public getMovingPiece() {
    return this.movingPiece;
  }
  public setMovingPiece(movingPiece: null | ValidCoordinate) {
    this.movingPiece = movingPiece;
  }
  public getGameBoardState() {
    return this.gameBoardState;
  }
  public setGameBoardState(gameBoardState: GameBoardState) {
    this.gameBoardState = gameBoardState;
  }
  public getIsVeryFirstTurn() {
    return this.isVeryFirstTurn;
  }
  public setIsVeryFirstTurn(isVeryFirstTurn: boolean) {
    this.isVeryFirstTurn = isVeryFirstTurn;
  }
  public getCurrentTurn() {
    return this.currentTurn;
  }
  public setCurrentTurn(currentTurn: Player) {
    this.currentTurn = currentTurn;
  }
  public getTurnPhase() {
    return this.turnPhase;
  }
  public setTurnPhase(
    turnPhase: typeof CAPTURE | typeof STACK_OR_CAPTURE_OR_PASS
  ) {
    this.turnPhase = turnPhase;
  }
  public getNumberOfTurnsIntoGame() {
    return this.numberOfTurnsIntoGame;
  }
  public setNumberOfTurnsIntoGame(numberOfTurnsIntoGame: number) {
    this.numberOfTurnsIntoGame = numberOfTurnsIntoGame;
  }
  public getIsFirstPlayerAI() {
    return this.isFirstPlayerAI;
  }
  public setIsFirstPlayerAI(isFirstPlayerAI: boolean) {
    this.isFirstPlayerAI = isFirstPlayerAI;
  }
  public getIsSecondPlayerAI() {
    return this.isSecondPlayerAI;
  }
  public setIsSecondPlayerAI(isSecondPlayerAI: boolean) {
    this.isSecondPlayerAI = isSecondPlayerAI;
  }
  public getBoardGameStateCopy(gamestate: GameBoardState): GameBoardState {
    return {
      "0,4": gamestate["0,4"],
      "0,5": gamestate["0,5"],
      "0,6": gamestate["0,6"],
      "0,7": gamestate["0,7"],
      "0,8": gamestate["0,8"],
      "1,3": gamestate["1,3"],
      "1,4": gamestate["1,4"],
      "1,5": gamestate["1,5"],
      "1,6": gamestate["1,6"],
      "1,7": gamestate["1,7"],
      "1,8": gamestate["1,8"],
      "2,2": gamestate["2,2"],
      "2,3": gamestate["2,3"],
      "2,4": gamestate["2,4"],
      "2,5": gamestate["2,5"],
      "2,6": gamestate["2,6"],
      "2,7": gamestate["2,7"],
      "2,8": gamestate["2,8"],
      "3,1": gamestate["3,1"],
      "3,2": gamestate["3,2"],
      "3,3": gamestate["3,3"],
      "3,4": gamestate["3,4"],
      "3,5": gamestate["3,5"],
      "3,6": gamestate["3,6"],
      "3,7": gamestate["3,7"],
      "3,8": gamestate["3,8"],
      "4,0": gamestate["4,0"],
      "4,1": gamestate["4,1"],
      "4,2": gamestate["4,2"],
      "4,3": gamestate["4,3"],
      "4,5": gamestate["4,5"],
      "4,6": gamestate["4,6"],
      "4,7": gamestate["4,7"],
      "4,8": gamestate["4,8"],
      "5,0": gamestate["5,0"],
      "5,1": gamestate["5,1"],
      "5,2": gamestate["5,2"],
      "5,3": gamestate["5,3"],
      "5,4": gamestate["5,4"],
      "5,5": gamestate["5,5"],
      "5,6": gamestate["5,6"],
      "5,7": gamestate["5,7"],
      "6,0": gamestate["6,0"],
      "6,1": gamestate["6,1"],
      "6,2": gamestate["6,2"],
      "6,3": gamestate["6,3"],
      "6,4": gamestate["6,4"],
      "6,5": gamestate["6,5"],
      "6,6": gamestate["6,6"],
      "7,0": gamestate["7,0"],
      "7,1": gamestate["7,1"],
      "7,2": gamestate["7,2"],
      "7,3": gamestate["7,3"],
      "7,4": gamestate["7,4"],
      "7,5": gamestate["7,5"],
      "8,0": gamestate["8,0"],
      "8,1": gamestate["8,1"],
      "8,2": gamestate["8,2"],
      "8,3": gamestate["8,3"],
      "8,4": gamestate["8,4"],
    };
  }
  public getWinnerMessage(winner: Player) {
    let message;

    if (winner === PLAYER_TWO && !this.isFirstPlayerAI) {
      message = "You lost.";
    }

    if (winner === PLAYER_TWO && this.isFirstPlayerAI) {
      message = "Winner: PLAYER_TWO (AI)";
    }

    if (winner === PLAYER_ONE && !this.isSecondPlayerAI) {
      message = "You lost.";
    }

    if (winner === PLAYER_ONE && this.isSecondPlayerAI) {
      message = "Winner: PLAYER_ONE (AI)";
    }

    return message;
  }

  public nextPhase(maybeMoveAI?: Function) {
    const skipTurnButton = document.getElementById("skipTurnButton");
    const phaseDiv = document.getElementById("phaseDiv");
    const turnDiv = document.getElementById("turnDiv");

    if (skipTurnButton) {
      skipTurnButton.classList.add("hidden");
    }

    // first turn of the game is special
    if (this.isVeryFirstTurn) {
      this.isVeryFirstTurn = false;
      this.turnPhase = TURN_PHASES.CAPTURE;
      this.currentTurn = PLAYER_TWO;
      this.numberOfTurnsIntoGame = this.numberOfTurnsIntoGame + 1;
      if (phaseDiv) {
        phaseDiv.innerHTML = "Phase: CAPTURE";
      }
      if (turnDiv) {
        turnDiv.innerHTML = `Turn: ${this.currentTurn} (${
          this.isSecondPlayerAI ? "AI" : "HUMAN"
        })`;
      }
      maybeMoveAI && maybeMoveAI();
      return;
    }

    // players turns aren't over yet
    if (
      this.currentTurn === PLAYER_ONE &&
      this.turnPhase === TURN_PHASES.CAPTURE
    ) {
      this.turnPhase = TURN_PHASES.STACK_OR_CAPTURE_OR_PASS;
      if (phaseDiv) {
        phaseDiv.innerHTML = "Phase: STACK OR CAPTURE";
      }
      if (!this.isFirstPlayerAI && skipTurnButton) {
        skipTurnButton.classList.remove("hidden");
      }
      return;
    }
    if (
      this.currentTurn === PLAYER_TWO &&
      this.turnPhase === TURN_PHASES.CAPTURE
    ) {
      this.turnPhase = TURN_PHASES.STACK_OR_CAPTURE_OR_PASS;
      if (phaseDiv) {
        phaseDiv.innerHTML = "Phase: STACK OR CAPTURE";
      }
      return;
    }

    // next players turn begins
    if (
      this.currentTurn === PLAYER_ONE &&
      this.turnPhase === TURN_PHASES.STACK_OR_CAPTURE_OR_PASS
    ) {
      this.turnPhase = TURN_PHASES.CAPTURE;
      this.currentTurn = PLAYER_TWO;
      this.numberOfTurnsIntoGame = this.numberOfTurnsIntoGame + 1;
      if (phaseDiv) {
        phaseDiv.innerHTML = "Phase: CAPTURE";
      }
      if (turnDiv) {
        turnDiv.innerHTML = `Turn: ${this.currentTurn} (${
          this.isSecondPlayerAI ? "AI" : "HUMAN"
        })`;
      }

      maybeMoveAI && maybeMoveAI();

      return;
    }
    if (
      this.currentTurn === PLAYER_TWO &&
      this.turnPhase === TURN_PHASES.STACK_OR_CAPTURE_OR_PASS
    ) {
      this.turnPhase = TURN_PHASES.CAPTURE;
      this.currentTurn = PLAYER_ONE;
      this.numberOfTurnsIntoGame = this.numberOfTurnsIntoGame + 1;
      if (phaseDiv) {
        phaseDiv.innerHTML = "Phase: CAPTURE";
      }
      if (turnDiv) {
        turnDiv.innerHTML = `Turn: ${this.currentTurn} (${
          this.isFirstPlayerAI ? "AI" : "HUMAN"
        })`;
      }
      maybeMoveAI && maybeMoveAI();

      return;
    }
  }

  public setInitialGameState(
    turn: typeof PLAYER_ONE | typeof PLAYER_TWO = PLAYER_ONE,
    phase:
      | typeof TURN_PHASES.CAPTURE
      | typeof TURN_PHASES.STACK_OR_CAPTURE_OR_PASS = TURN_PHASES.CAPTURE,
    numberOfTurns: number = 0
  ) {
    this.currentTurn = turn;
    this.turnPhase = phase;
    this.numberOfTurnsIntoGame = numberOfTurns;
    this.isVeryFirstTurn = numberOfTurns === 0;
  }
}

export default new GameState();
