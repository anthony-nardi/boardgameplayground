import { getPixelCoordinatesFromBoardCoordinates } from "../logic/gameBoardHelpers";
import {
  PLAYABLE_VERTICES,
  TOTT,
  TZAAR,
  TZARRA,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../constants";
import WindowHelper from "./WindowHelper";
import { drawCachedBoard } from "./cachedBoard";
import GameState from "../logic/gameState";
import { List } from "immutable";
import GamePieceRenderer from "./gamePieceRenderer";
import { ValidCoordinate } from "../types/types";
import { circlePatternInsideOut } from "../logic/initialSetupOptions";

function getContext() {
  if (!window.GAME_STATE_BOARD_CANVAS) {
    throw new Error("GAME_STATE_BOARD_CANVAS not ready");
  }

  return window.GAME_STATE_BOARD_CANVAS.getContext("2d");
}

export function drawCoordinates() {
  PLAYABLE_VERTICES.map(drawCoordinate);
}

export function drawCoordinate(coordinate: ValidCoordinate) {
  const context = getContext();
  const [x, y] = coordinate.split(",");

  if (
    !GamePieceRenderer.TRIANGLE_HEIGHT ||
    !GamePieceRenderer.TRIANGLE_SIDE_LENGTH
  ) {
    throw new Error("GamePieceRenderer not ready");
  }

  if (!context) {
    throw new Error("context not ready");
  }

  const offsetXToCenter =
    WindowHelper.width / 2 - 4 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH;
  const offsetYToCenter =
    WindowHelper.height / 2 - 4 * GamePieceRenderer.TRIANGLE_HEIGHT;

  const offsetX =
    +x * GamePieceRenderer.TRIANGLE_SIDE_LENGTH -
    Math.max(4 - +y, 0) * GamePieceRenderer.TRIANGLE_SIDE_LENGTH;

  const xPos =
    (Math.abs(4 - +y) * GamePieceRenderer.TRIANGLE_SIDE_LENGTH) / 2 +
    offsetX +
    offsetXToCenter;

  const yPos = +y * GamePieceRenderer.TRIANGLE_HEIGHT + offsetYToCenter;
  context.font = "1rem Helvetica";
  context.fillStyle = "#ccc";
  context.fillRect(xPos + 5, yPos - 5, 30, 20);
  context.fillStyle = "#000";

  context.fillText(coordinate, xPos + 10, yPos + 10);
}

export function drawGameBoardState() {
  clearCanvas();
  drawCachedBoard();
  drawGamePieces();
  if (
    window.localStorage &&
    window.localStorage.getItem("DEBUG_TZAAR") === "true"
  ) {
    drawCoordinates();
  }
}

export function drawStaticGamePiece(
  gamePiece: any,
  coordinate: ValidCoordinate
) {
  if (!gamePiece || gamePiece.isDragging) {
    return;
  }

  const [xPos, yPos] =
    getPixelCoordinatesFromBoardCoordinates(coordinate).split(",");

  drawGamePiece(gamePiece, Number(xPos), Number(yPos));
}

export function drawGamePiece(gamePiece: any, xPos: number, yPos: number) {
  const context = getContext();

  if (!context) {
    throw new Error("context not available.");
  }

  if (
    !GamePieceRenderer.GAME_PIECE_RADIUS ||
    !GamePieceRenderer.CANVAS_SIDE_LENGTH
  ) {
    throw new Error("GamePieceRenderer not ready.");
  }

  const dx = Math.floor(xPos - GamePieceRenderer.GAME_PIECE_RADIUS);
  const dy = Math.floor(yPos - GamePieceRenderer.GAME_PIECE_RADIUS);
  const dw = Math.floor(
    GamePieceRenderer.CANVAS_SIDE_LENGTH / WindowHelper.devicePixelRatio
  );
  const dh = Math.floor(
    GamePieceRenderer.CANVAS_SIDE_LENGTH / WindowHelper.devicePixelRatio
  );

  if (gamePiece.ownedBy === PLAYER_ONE && gamePiece.type === TOTT) {
    context.drawImage(GamePieceRenderer.PLAYER_ONE_TOTT, dx, dy, dw, dh);
  }
  if (gamePiece.ownedBy === PLAYER_ONE && gamePiece.type === TZARRA) {
    context.drawImage(GamePieceRenderer.PLAYER_ONE_TZARRA, dx, dy, dw, dh);
  }
  if (gamePiece.ownedBy === PLAYER_ONE && gamePiece.type === TZAAR) {
    context.drawImage(GamePieceRenderer.PLAYER_ONE_TZAAR, dx, dy, dw, dh);
  }
  if (gamePiece.ownedBy === PLAYER_TWO && gamePiece.type === TOTT) {
    context.drawImage(GamePieceRenderer.PLAYER_TWO_TOTT, dx, dy, dw, dh);
  }
  if (gamePiece.ownedBy === PLAYER_TWO && gamePiece.type === TZARRA) {
    context.drawImage(GamePieceRenderer.PLAYER_TWO_TZARRA, dx, dy, dw, dh);
  }
  if (gamePiece.ownedBy === PLAYER_TWO && gamePiece.type === TZAAR) {
    context.drawImage(GamePieceRenderer.PLAYER_TWO_TZAAR, dx, dy, dw, dh);
  }

  const textPositionX = Math.floor(+xPos - 6);
  const textPositionY = Math.floor(+yPos + 6);

  context.font = "1.15rem Helvetica";
  context.fillStyle = gamePiece.type === TZAAR ? "#000" : "#fff";
  context.fillText(String(gamePiece.stackSize), textPositionX, textPositionY);
}

export function drawGamePieces() {
  Object.keys(GameState.getGameBoardState()).forEach((key) => {
    // @ts-expect-error fix
    drawStaticGamePiece(GameState.getGameBoardState()[key], key);
  });
}

export function clearCanvas() {
  const context = getContext();
  if (!context) {
    throw new Error("context not available");
  }
  context.clearRect(0, 0, WindowHelper.width, WindowHelper.height);
}

function timeFunction(t: number) {
  return --t * t * t + 1;
}

export function renderInitializingBoard(piecesToDraw: any, callback: Function) {
  let piecesToRenderList = List();

  const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  let coordinates = Object.keys(piecesToDraw);
  shuffleArray(coordinates);
  let reversed = [...circlePatternInsideOut];
  reversed.reverse();
  if (Math.random() < 0.5) {
    coordinates = circlePatternInsideOut;
  }
  if (Math.random() < 0.2) {
    coordinates = reversed;
  }

  for (let index in coordinates) {
    const coordinate = coordinates[index];
    const piece = piecesToDraw[coordinate];
    const to = getPixelCoordinatesFromBoardCoordinates(
      coordinate as ValidCoordinate
    );
    const from = `${WindowHelper.width / 2},${WindowHelper.height / 2}`;

    piecesToRenderList = piecesToRenderList.push({
      piece,
      from,
      to,
      // @ts-expect-error fix
      delay: index * 25,
    });
  }

  renderMovingPieces(piecesToRenderList, 500, Date.now(), () => {
    let index = 0;
    for (const coordinate in piecesToDraw) {
      const piece = piecesToDraw[coordinate];
      GameState.getGameBoardState()[coordinate as ValidCoordinate] = piece;
      index = index + 1;
    }

    callback();
  });
}

function renderMovingPieces(
  piecesToRenderList: List<any>,
  duration: number,
  startTime: number,
  callback: Function
) {
  piecesToRenderList = piecesToRenderList.filter((piece) => piece.piece);

  const now = Date.now();

  const timePassedInMilliSec = now - startTime;

  if (timePassedInMilliSec > duration + piecesToRenderList.last().delay) {
    callback();
    return;
  }

  clearCanvas();
  drawCachedBoard();

  piecesToRenderList.forEach(
    ({
      piece,
      from,
      to,
      delay,
    }: {
      piece: any;
      from: string;
      to: string;
      delay: number;
    }) => {
      const timePassed = Math.min(
        Math.max((now - startTime - delay) / duration, 0),
        1
      );

      const [fromX, fromY] = from.split(",");
      const [toX, toY] = to.split(",");

      const distance = Math.sqrt(
        Math.pow(+fromX - +toX, 2) + Math.pow(+fromY - +toY, 2)
      );

      const currentDistance = (timeFunction(timePassed) * distance) / distance;

      const renderX = (1 - currentDistance) * +fromX + currentDistance * +toX;
      const renderY = (1 - currentDistance) * +fromY + currentDistance * +toY;

      drawGamePiece(piece, renderX, renderY);
    }
  );

  window &&
    window.requestAnimationFrame(() => {
      renderMovingPieces(piecesToRenderList, duration, startTime, callback);
    });
}

export function renderMovingPiece(
  piece: any,
  from: string,
  to: string,
  duration: number,
  startTime: number,
  callback: Function
) {
  const now = Date.now();

  const timePassedInMilliSec = now - startTime;

  if (timePassedInMilliSec > duration) {
    callback();
    return;
  }

  const timePassed = Math.min(Math.max((now - startTime) / duration, 0), 1);

  const [fromX, fromY] = from.split(",");
  const [toX, toY] = to.split(",");

  const distance = Math.sqrt(
    Math.pow(+fromX - +toX, 2) + Math.pow(+fromY - +toY, 2)
  );

  const currentDistance = (timeFunction(timePassed) * distance) / distance;

  const renderX = (1 - currentDistance) * +fromX + currentDistance * +toX;
  const renderY = (1 - currentDistance) * +fromY + currentDistance * +toY;

  clearCanvas();
  drawCachedBoard();
  drawGamePieces();
  drawGamePiece(piece, renderX, renderY);

  window &&
    window.requestAnimationFrame(() => {
      renderMovingPiece(piece, from, to, duration, startTime, callback);
    });
}
