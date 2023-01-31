import { getPixelCoordinatesFromBoardCoordinates } from "./gameBoardHelpers";
import {
  DEBUG,
  TRIANGLE_SIDE_LENGTH,
  TRIANGLE_HEIGHT,
  PLAYABLE_VERTICES,
  TOTT,
  TZAAR,
  TZARRA,
  PLAYER_ONE,
  PLAYER_TWO,
  GamePieceRecordProps,

} from "./constants";
import WindowHelper from "./WindowHelper";
import { drawCachedBoard } from "./cachedBoard";
import { gameBoardState, setNewgameBoardState } from "./gameState";
import { List, RecordOf } from "immutable";
import GamePieceRenderer from "./GamePieceRenderer";
import { ValidCoordinate } from "./types/types";

function getContext() {

  return window.GAME_STATE_BOARD_CANVAS.getContext("2d");
}

export function drawCoordinates() {
  if (!DEBUG) {
    return;
  }
  PLAYABLE_VERTICES.map(drawCoordinate);
}

export function drawCoordinate(coordinate: ValidCoordinate) {
  const context = getContext();
  const [x, y] = coordinate.split(",");


  if (!GamePieceRenderer.TRIANGLE_HEIGHT || !GamePieceRenderer.TRIANGLE_SIDE_LENGTH) {
    throw new Error('GamePieceRenderer not ready')
  }

  if (!context) {
    throw new Error('context not ready')
  }


  const offsetXToCenter = WindowHelper.width / 2 - 4 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH;
  const offsetYToCenter = WindowHelper.height / 2 - 4 * GamePieceRenderer.TRIANGLE_HEIGHT;

  const offsetX =
    +x * GamePieceRenderer.TRIANGLE_SIDE_LENGTH - Math.max(4 - +y, 0) * GamePieceRenderer.TRIANGLE_SIDE_LENGTH;

  const xPos =
    (Math.abs(4 - +y) * GamePieceRenderer.TRIANGLE_SIDE_LENGTH) / 2 + offsetX + offsetXToCenter;

  const yPos = y * GamePieceRenderer.TRIANGLE_HEIGHT + offsetYToCenter;
  context.font = ".5rem Helvetica";
  context.fillStyle = "#39ff14";
  context.fillText(coordinate, xPos + 10, yPos + 10);
}

export function drawGameBoardState() {
  clearCanvas();
  drawCachedBoard();
  drawGamePieces();
  drawCoordinates();
}

export function drawStaticGamePiece(gamePiece: RecordOf<GamePieceRecordProps>, coordinate: ValidCoordinate) {
  if (gamePiece.isDragging || !gamePiece) {
    return;
  }

  const [xPos, yPos] = getPixelCoordinatesFromBoardCoordinates(
    coordinate
  ).split(",");

  drawGamePiece(gamePiece, Number(xPos), Number(yPos));
}

export function drawGamePiece(gamePiece: RecordOf<GamePieceRecordProps>, xPos: number, yPos: number) {
  const context = getContext();

  if (!context) {
    throw new Error('context not available.')
  }

  if (!GamePieceRenderer.GAME_PIECE_RADIUS || !GamePieceRenderer.CANVAS_SIDE_LENGTH) {
    throw new Error('GamePieceRenderer not ready.')
  }

  const dx = Math.floor(xPos - GamePieceRenderer.GAME_PIECE_RADIUS)
  const dy = Math.floor(yPos - GamePieceRenderer.GAME_PIECE_RADIUS)
  const dw = Math.floor(GamePieceRenderer.CANVAS_SIDE_LENGTH / WindowHelper.devicePixelRatio)
  const dh = Math.floor(GamePieceRenderer.CANVAS_SIDE_LENGTH / WindowHelper.devicePixelRatio)

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

  const textPositionX = Math.floor(+xPos - 6)
  const textPositionY = Math.floor(+yPos + 6)

  context.font = "1.15rem Helvetica";
  context.fillStyle = gamePiece.type === TZAAR ? "#000" : "#fff";
  context.fillText(String(gamePiece.stackSize), textPositionX, textPositionY);
}

export function drawGamePieces() {
  gameBoardState.forEach(drawStaticGamePiece);
}

export function clearCanvas() {
  const context = getContext();
  if (!context) {
    throw new Error('context not available')
  }
  context.clearRect(0, 0, WindowHelper.width, WindowHelper.height);
}

function timeFunction(t: number) {
  return --t * t * t + 1;
}

export function renderInitializingBoard(piecesToDraw, callback: Function) {
  let index = 0;
  let piecesToRenderList = List();
  for (const coordinate in piecesToDraw) {
    const piece = piecesToDraw[coordinate]
    const to = getPixelCoordinatesFromBoardCoordinates(coordinate);
    const from = `${WindowHelper.width / 2},${WindowHelper.height / 2}`;

    piecesToRenderList = piecesToRenderList.push({
      piece,
      from,
      to,
      delay: index * 25
    });

    index = index + 1;
  }



  renderMovingPieces(piecesToRenderList, 500, Date.now(), () => {
    let index = 0;
    for (const coordinate in piecesToDraw) {
      const piece = piecesToDraw[coordinate]
      setNewgameBoardState(gameBoardState.set(coordinate, piece));
      index = index + 1;
    }


    callback();
  });
}

function renderMovingPieces(piecesToRenderList, duration, startTime, callback) {
  const now = Date.now();

  const timePassedInMilliSec = now - startTime;

  if (timePassedInMilliSec > duration + piecesToRenderList.last().delay) {
    callback();
    return;
  }

  clearCanvas();
  drawCachedBoard();

  piecesToRenderList.forEach(({ piece, from, to, delay }) => {
    const timePassed = Math.min(
      Math.max((now - startTime - delay) / duration, 0),
      1
    );

    const [fromX, fromY] = from.split(",");
    const [toX, toY] = to.split(",");

    const distance = Math.sqrt(
      Math.pow(fromX - toX, 2) + Math.pow(fromY - toY, 2)
    );

    const currentDistance = (timeFunction(timePassed) * distance) / distance;

    const renderX = (1 - currentDistance) * fromX + currentDistance * toX;
    const renderY = (1 - currentDistance) * fromY + currentDistance * toY;

    drawGamePiece(piece, renderX, renderY);
  });

  window && window.requestAnimationFrame(() => {
    renderMovingPieces(piecesToRenderList, duration, startTime, callback);
  });
}

export function renderMovingPiece(
  piece,
  from,
  to,
  duration,
  startTime,
  callback
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
    Math.pow(fromX - toX, 2) + Math.pow(fromY - toY, 2)
  );

  const currentDistance = (timeFunction(timePassed) * distance) / distance;

  const renderX = (1 - currentDistance) * fromX + currentDistance * toX;
  const renderY = (1 - currentDistance) * fromY + currentDistance * toY;

  clearCanvas();
  drawCachedBoard();
  drawGamePieces();
  drawGamePiece(piece, renderX, renderY);

  window && window.requestAnimationFrame(() => {
    renderMovingPiece(piece, from, to, duration, startTime, callback);
  });
}
