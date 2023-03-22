import {
  PLAYER_ONE,
  PLAYER_TWO,
  AI_ANIMATION_DURATION,
  RING_PLACEMENT,
  RING_MOVEMENT,
} from "../constants";
import { Player, PlayerPieces, ValidCoordinate } from "../types/types";
import { checkGameStateAndStartNextTurn } from "./gameLogic";
import {
  drawGameBoardState,
  renderMovingPiece,
} from "../rendering/renderHelpers";
import GameHistory from "../utils/GameHistory";
import { getPixelCoordinatesFromBoardCoordinates } from "./gameBoardHelpers";
import { isDebugModeOn } from "./utils";

export type Phase = typeof RING_PLACEMENT | typeof RING_MOVEMENT;

export type PieceState = {
  isDragging: boolean;
  ownedBy: Player;
  type: PlayerPieces;
};

export type GameBoardState = {
  [K in ValidCoordinate]: false | PieceState;
};

class GameState {
  private gameStarted = false;
  private currentTurn: Player = PLAYER_ONE;
  private phase: Phase = "RING_PLACEMENT";
  private numberOfTurnsIntoGame = 0;
  private isFirstPlayerAI = true;
  private isSecondPlayerAI = false;
  private movingPiece: null | ValidCoordinate = null;
  private playerOneRingsPlaced = 0;
  private playerTwoRingsPlaced = 0;
  private gameBoardState: GameBoardState = {
    "6,0": false,
    "7,0": false,
    "8,0": false,
    "9,0": false,
    "10,0": false,
    "4,1": false,
    "5,1": false,
    "6,1": false,
    "7,1": false,
    "8,1": false,
    "9,1": false,
    "10,1": false,
    "11,1": false,
    "3,2": false,
    "4,2": false,
    "5,2": false,
    "6,2": false,
    "7,2": false,
    "8,2": false,
    "9,2": false,
    "10,2": false,
    "11,2": false,
    "2,3": false,
    "3,3": false,
    "4,3": false,
    "5,3": false,
    "6,3": false,
    "7,3": false,
    "8,3": false,
    "9,3": false,
    "10,3": false,
    "11,3": false,
    "1,4": false,
    "2,4": false,
    "3,4": false,
    "4,4": false,
    "5,4": false,
    "6,4": false,
    "7,4": false,
    "8,4": false,
    "9,4": false,
    "10,4": false,
    "11,4": false,
    "1,5": false,
    "2,5": false,
    "3,5": false,
    "4,5": false,
    "5,5": false,
    "6,5": false,
    "7,5": false,
    "8,5": false,
    "9,5": false,
    "10,5": false,
    "0,6": false,
    "1,6": false,
    "2,6": false,
    "3,6": false,
    "4,6": false,
    "5,6": false,
    "6,6": false,
    "7,6": false,
    "8,6": false,
    "9,6": false,
    "10,6": false,
    "0,7": false,
    "1,7": false,
    "2,7": false,
    "3,7": false,
    "4,7": false,
    "5,7": false,
    "6,7": false,
    "7,7": false,
    "8,7": false,
    "9,7": false,
    "0,8": false,
    "1,8": false,
    "2,8": false,
    "3,8": false,
    "4,8": false,
    "5,8": false,
    "6,8": false,
    "7,8": false,
    "8,8": false,
    "0,9": false,
    "1,9": false,
    "2,9": false,
    "3,9": false,
    "4,9": false,
    "5,9": false,
    "6,9": false,
    "7,9": false,
    "0,10": false,
    "1,10": false,
    "2,10": false,
    "3,10": false,
    "4,10": false,
    "5,10": false,
    "6,10": false,
    "1,11": false,
    "2,11": false,
    "3,11": false,
    "4,11": false,
  };
  public getHasGameStarted() {
    return this.gameStarted;
  }
  public setHasGameStarted() {
    this.gameStarted = true;
  }
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
  public getPlayerOneRingsPlaced() {
    return this.playerOneRingsPlaced;
  }
  public setPlayerOneRing(coordinate: ValidCoordinate) {
    this.playerOneRingsPlaced++;
    this.gameBoardState[coordinate] = {
      isDragging: false,
      ownedBy: PLAYER_ONE,
      type: "RING",
    };
  }
  public getPlayerTwoRingsPlaced() {
    return this.playerTwoRingsPlaced;
  }
  public setPlayerTwoRing(coordinate: ValidCoordinate) {
    this.playerTwoRingsPlaced++;
    this.gameBoardState[coordinate] = {
      isDragging: false,
      ownedBy: PLAYER_TWO,
      type: "RING",
    };
  }
  public getCurrentTurn() {
    return this.currentTurn;
  }
  public setCurrentTurn(currentTurn: Player) {
    this.currentTurn = currentTurn;
  }
  public getPhase() {
    return this.phase;
  }
  public setPhase(phase: Phase) {
    this.phase = phase;
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
  public setCoordinateValue(
    coordinate: ValidCoordinate,
    piece: PieceState | false
  ) {
    this.gameBoardState[coordinate] = piece;
  }
  public getBoardGameStateCopy(gamestate: GameBoardState): GameBoardState {
    return {
      "6,0": gamestate["6,0"],
      "7,0": gamestate["7,0"],
      "8,0": gamestate["8,0"],
      "9,0": gamestate["9,0"],
      "10,0": gamestate["10,0"],
      "4,1": gamestate["4,1"],
      "5,1": gamestate["5,1"],
      "6,1": gamestate["6,1"],
      "7,1": gamestate["7,1"],
      "8,1": gamestate["8,1"],
      "9,1": gamestate["9,1"],
      "10,1": gamestate["10,1"],
      "11,1": gamestate["11,1"],
      "3,2": gamestate["3,2"],
      "4,2": gamestate["4,2"],
      "5,2": gamestate["5,2"],
      "6,2": gamestate["6,2"],
      "7,2": gamestate["7,2"],
      "8,2": gamestate["8,2"],
      "9,2": gamestate["9,2"],
      "10,2": gamestate["10,2"],
      "11,2": gamestate["11,2"],
      "2,3": gamestate["2,3"],
      "3,3": gamestate["3,3"],
      "4,3": gamestate["4,3"],
      "5,3": gamestate["5,3"],
      "6,3": gamestate["6,3"],
      "7,3": gamestate["7,3"],
      "8,3": gamestate["8,3"],
      "9,3": gamestate["9,3"],
      "10,3": gamestate["10,3"],
      "11,3": gamestate["11,3"],
      "1,4": gamestate["1,4"],
      "2,4": gamestate["2,4"],
      "3,4": gamestate["3,4"],
      "4,4": gamestate["4,4"],
      "5,4": gamestate["5,4"],
      "6,4": gamestate["6,4"],
      "7,4": gamestate["7,4"],
      "8,4": gamestate["8,4"],
      "9,4": gamestate["9,4"],
      "10,4": gamestate["10,4"],
      "11,4": gamestate["11,4"],
      "1,5": gamestate["1,5"],
      "2,5": gamestate["2,5"],
      "3,5": gamestate["3,5"],
      "4,5": gamestate["4,5"],
      "5,5": gamestate["5,5"],
      "6,5": gamestate["6,5"],
      "7,5": gamestate["7,5"],
      "8,5": gamestate["8,5"],
      "9,5": gamestate["9,5"],
      "10,5": gamestate["10,5"],
      "0,6": gamestate["0,6"],
      "1,6": gamestate["1,6"],
      "2,6": gamestate["2,6"],
      "3,6": gamestate["3,6"],
      "4,6": gamestate["4,6"],
      "5,6": gamestate["5,6"],
      "6,6": gamestate["6,6"],
      "7,6": gamestate["7,6"],
      "8,6": gamestate["8,6"],
      "9,6": gamestate["9,6"],
      "10,6": gamestate["10,6"],
      "0,7": gamestate["0,7"],
      "1,7": gamestate["1,7"],
      "2,7": gamestate["2,7"],
      "3,7": gamestate["3,7"],
      "4,7": gamestate["4,7"],
      "5,7": gamestate["5,7"],
      "6,7": gamestate["6,7"],
      "7,7": gamestate["7,7"],
      "8,7": gamestate["8,7"],
      "9,7": gamestate["9,7"],
      "0,8": gamestate["0,8"],
      "1,8": gamestate["1,8"],
      "2,8": gamestate["2,8"],
      "3,8": gamestate["3,8"],
      "4,8": gamestate["4,8"],
      "5,8": gamestate["5,8"],
      "6,8": gamestate["6,8"],
      "7,8": gamestate["7,8"],
      "8,8": gamestate["8,8"],
      "0,9": gamestate["0,9"],
      "1,9": gamestate["1,9"],
      "2,9": gamestate["2,9"],
      "3,9": gamestate["3,9"],
      "4,9": gamestate["4,9"],
      "5,9": gamestate["5,9"],
      "6,9": gamestate["6,9"],
      "7,9": gamestate["7,9"],
      "0,10": gamestate["0,10"],
      "1,10": gamestate["1,10"],
      "2,10": gamestate["2,10"],
      "3,10": gamestate["3,10"],
      "4,10": gamestate["4,10"],
      "5,10": gamestate["5,10"],
      "6,10": gamestate["6,10"],
      "1,11": gamestate["1,11"],
      "2,11": gamestate["2,11"],
      "3,11": gamestate["3,11"],
      "4,11": gamestate["4,11"],
    } as GameBoardState;
  }
  public getWinnerMessage(winner: Player) {
    let message;

    if (winner === PLAYER_TWO && !this.isFirstPlayerAI) {
      message = "You lost.";
    }

    if (winner === PLAYER_TWO && this.isFirstPlayerAI) {
      message = "Winner: PLAYER_TWO (AI)";
    }

    if (winner === PLAYER_TWO && this.isSecondPlayerAI) {
      message = "Winner: PLAYER_TWO (AI)";
    }

    if (
      winner === PLAYER_ONE &&
      this.isSecondPlayerAI &&
      !this.isFirstPlayerAI
    ) {
      message = "You won!";
    }

    return message;
  }
}

export default new GameState();
