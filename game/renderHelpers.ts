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
  PIXEL_RATIO
} from "./constants";
import { drawCachedBoard } from "./cachedBoard";
import { gameBoardState, setNewgameBoardState } from "./gameState";
import { List } from "immutable";
import {
  PLAYER_ONE_TOTT,
  PLAYER_ONE_TZAAR,
  PLAYER_ONE_TZARRA,
  PLAYER_TWO_TOTT,
  PLAYER_TWO_TZAAR,
  PLAYER_TWO_TZARRA,
  GAME_PIECE_RADIUS,
  CANVAS_SIDE_LENGTH
} from "./gamePieceRenderer";

function getContext() {
  return window.GAME_STATE_BOARD_CANVAS.getContext("2d");
}

export function drawCoordinates() {
  if (!DEBUG) {
    return;
  }
  PLAYABLE_VERTICES.map(drawCoordinate);
}

export function drawCoordinate(coordinate) {
  const context = getContext();
  const [x, y] = coordinate.split(",");

  const offsetXToCenter = window && window.innerWidth / 2 - 4 * TRIANGLE_SIDE_LENGTH;
  const offsetYToCenter = window && window.innerHeight / 2 - 4 * TRIANGLE_HEIGHT;

  const offsetX =
    x * TRIANGLE_SIDE_LENGTH - Math.max(4 - y, 0) * TRIANGLE_SIDE_LENGTH;

  const xPos =
    (Math.abs(4 - y) * TRIANGLE_SIDE_LENGTH) / 2 + offsetX + offsetXToCenter;

  const yPos = y * TRIANGLE_HEIGHT + offsetYToCenter;
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

export function drawStaticGamePiece(gamePiece, coordinate) {
  const [xPos, yPos] = getPixelCoordinatesFromBoardCoordinates(
    coordinate
  ).split(",");

  if (gamePiece.isDragging || !gamePiece) {
    return;
  }

  drawGamePiece(gamePiece, xPos, yPos);
}

export function drawGamePiece(gamePiece, xPos, yPos) {
  const context = getContext();
  if (gamePiece.ownedBy === PLAYER_ONE && gamePiece.type === TOTT) {
    context.drawImage(
      PLAYER_ONE_TOTT,
      xPos - GAME_PIECE_RADIUS,
      yPos - GAME_PIECE_RADIUS,
      CANVAS_SIDE_LENGTH / PIXEL_RATIO(),
      CANVAS_SIDE_LENGTH / PIXEL_RATIO()
    );
  }
  if (gamePiece.ownedBy === PLAYER_ONE && gamePiece.type === TZARRA) {
    context.drawImage(
      PLAYER_ONE_TZARRA,
      xPos - GAME_PIECE_RADIUS,
      yPos - GAME_PIECE_RADIUS,
      CANVAS_SIDE_LENGTH / PIXEL_RATIO(),
      CANVAS_SIDE_LENGTH / PIXEL_RATIO()
    );
  }
  if (gamePiece.ownedBy === PLAYER_ONE && gamePiece.type === TZAAR) {
    context.drawImage(
      PLAYER_ONE_TZAAR,
      xPos - GAME_PIECE_RADIUS,
      yPos - GAME_PIECE_RADIUS,
      CANVAS_SIDE_LENGTH / PIXEL_RATIO(),
      CANVAS_SIDE_LENGTH / PIXEL_RATIO()
    );
  }
  if (gamePiece.ownedBy === PLAYER_TWO && gamePiece.type === TOTT) {
    context.drawImage(
      PLAYER_TWO_TOTT,
      xPos - GAME_PIECE_RADIUS,
      yPos - GAME_PIECE_RADIUS,
      CANVAS_SIDE_LENGTH / PIXEL_RATIO(),
      CANVAS_SIDE_LENGTH / PIXEL_RATIO()
    );
  }
  if (gamePiece.ownedBy === PLAYER_TWO && gamePiece.type === TZARRA) {
    context.drawImage(
      PLAYER_TWO_TZARRA,
      xPos - GAME_PIECE_RADIUS,
      yPos - GAME_PIECE_RADIUS,
      CANVAS_SIDE_LENGTH / PIXEL_RATIO(),
      CANVAS_SIDE_LENGTH / PIXEL_RATIO()
    );
  }
  if (gamePiece.ownedBy === PLAYER_TWO && gamePiece.type === TZAAR) {
    context.drawImage(
      PLAYER_TWO_TZAAR,
      xPos - GAME_PIECE_RADIUS,
      yPos - GAME_PIECE_RADIUS,
      CANVAS_SIDE_LENGTH / PIXEL_RATIO(),
      CANVAS_SIDE_LENGTH / PIXEL_RATIO()
    );
  }

  context.font = "1.15rem Helvetica";
  context.fillStyle = gamePiece.type === TZAAR ? "#000" : "#fff";
  context.fillText(gamePiece.stackSize, +xPos - 6, +yPos + 6);
}

export function drawGamePieces() {
  gameBoardState.forEach(drawStaticGamePiece);
}

export function clearCanvas() {
  const context = getContext();
  context.clearRect(0, 0, window && window.innerWidth, window && window.innerHeight);
}

function timeFunction(t) {
  return --t * t * t + 1;
}

export function renderInitializingBoard(piecesToDraw, callback) {
  let index = 0;
  let piecesToRenderList = List();
  piecesToDraw.forEach((piece, coordinate) => {
    const to = getPixelCoordinatesFromBoardCoordinates(coordinate);
    const from = `${window && window.innerWidth / 2},${window && window.innerHeight / 2}`;

    piecesToRenderList = piecesToRenderList.push({
      piece,
      from,
      to,
      delay: index * 25
    });

    index = index + 1;
  });

  renderMovingPieces(piecesToRenderList, 500, Date.now(), () => {
    let index = 0;
    piecesToDraw.forEach((piece, coordinate) => {
      setNewgameBoardState(gameBoardState.set(coordinate, piece));
      index = index + 1;
    });
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
