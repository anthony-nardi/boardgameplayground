
import WindowHelper from "./WindowHelper";
import GamePieceRenderer, { NUMBER_OF_COLS, NUMBER_OF_ROWS } from "./gamePieceRenderer";
import { AllCoordinates } from "./types/types";
import { useMemo } from "react";
const CACHED_CANVAS = document.createElement("canvas");

const COORDS_TO_NOT_RENDER = [
  "0,0",
  "0,1",
  "1,0",
  "2,0",
  "3,0",
  "1,1",
  "2,1",
  "0,2",
  "1,2",
  "0,3",
  "7,5",
  "7,6",
  "6,7",
  "6,6",
  "5,7",
  "6,7",
  "4,3",
  "3,4",
  "4,4",
  "7,7"
] as const

const OFFSET_X = 0;

const grid = getInitialGridState();

function initCanvas() {


  CACHED_CANVAS.width = WindowHelper.width * WindowHelper.devicePixelRatio
  CACHED_CANVAS.height = WindowHelper.height * WindowHelper.devicePixelRatio
  CACHED_CANVAS.style.width = `${WindowHelper.width}px`;
  CACHED_CANVAS.style.height = `${WindowHelper.height}px`;

  if (!window.GAME_STATE_BOARD_CANVAS) {
    throw new Error('GAME_STATE_BOARD_CANVAS is not ready')
  }

  window.GAME_STATE_BOARD_CANVAS.width = WindowHelper.width * WindowHelper.devicePixelRatio
  window.GAME_STATE_BOARD_CANVAS.height = WindowHelper.height * WindowHelper.devicePixelRatio
  window.GAME_STATE_BOARD_CANVAS.style.width = `${WindowHelper.width}px`;
  window.GAME_STATE_BOARD_CANVAS.style.height = `${WindowHelper.height}px`;

  const cachedCanvasContext = CACHED_CANVAS.getContext("2d", { willReadFrequently: true })
  const gameStateCanvasContext = window.GAME_STATE_BOARD_CANVAS.getContext("2d", { willReadFrequently: true })

  if (!cachedCanvasContext || !gameStateCanvasContext) {
    throw new Error('context isnt ready')
  }

  cachedCanvasContext.setTransform(
    WindowHelper.devicePixelRatio,
    0,
    0,
    WindowHelper.devicePixelRatio,
    0,
    0
  );
  gameStateCanvasContext.setTransform(
    WindowHelper.devicePixelRatio,
    0,
    0,
    WindowHelper.devicePixelRatio,
    0,
    0
  );
}

function getContext() {
  return CACHED_CANVAS.getContext("2d", { willReadFrequently: true });
}

function getInitialGridState(): AllCoordinates[] {
  const vertices: AllCoordinates[] = [];

  for (let colIndex = 0; colIndex < NUMBER_OF_COLS; colIndex++) {
    for (let rowIndex = 0; rowIndex < NUMBER_OF_ROWS; rowIndex++) {
      const coordinate = `${colIndex},${rowIndex}` as AllCoordinates
      vertices.push(coordinate);
    }
  }

  return vertices;
}
let cachedBoardImageData: null | ImageData = null

function getImageData() {
  if (cachedBoardImageData) {
    return cachedBoardImageData
  }

  const context = getContext();
  if (!context) {
    throw new Error('context isnt ready')
  }

  cachedBoardImageData = context.getImageData(
    OFFSET_X * WindowHelper.devicePixelRatio,
    0,
    Math.floor(WindowHelper.devicePixelRatio * (WindowHelper.width)),
    Math.floor(WindowHelper.devicePixelRatio * (WindowHelper.height))
  );

  return cachedBoardImageData
}


export function drawCachedBoard() {
  const context = window.GAME_STATE_BOARD_CANVAS && window.GAME_STATE_BOARD_CANVAS.getContext("2d", { willReadFrequently: true });
  const imageData = getImageData();

  if (!context) {
    throw new Error('context isnt ready')
  }
  if (!GamePieceRenderer.TRIANGLE_SIDE_LENGTH || !GamePieceRenderer.TRIANGLE_HEIGHT) {
    throw new Error('GamePieceRenderer not ready.')
  }
  context.putImageData(
    imageData,
    Math.floor((WindowHelper.width / 2 - 4 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH) * WindowHelper.devicePixelRatio),
    Math.floor((WindowHelper.height / 2 - 4 * GamePieceRenderer.TRIANGLE_HEIGHT) * WindowHelper.devicePixelRatio)
  );
}

export function drawInitialGrid() {
  initCanvas();
  grid.map(renderTriangleFromVertex);
  renderHexagonBorder();
  renderInnerHexagonBorder();
  drawCachedBoard();
}

function renderTriangleFromVertex(coordinate: AllCoordinates) {
  const context = getContext();
  if (!context) {
    throw new Error('context isnt ready')
  }
  if (COORDS_TO_NOT_RENDER.some(coord => coord === coordinate)) {
    return;
  }
  if (!GamePieceRenderer.TRIANGLE_SIDE_LENGTH || !GamePieceRenderer.TRIANGLE_HEIGHT) {
    throw new Error('GamePieceRenderer not ready.')
  }
  const [x, y] = coordinate.split(",");

  const numX = Number(x)
  const numY = Number(y)

  const offsetX = (numY * GamePieceRenderer.TRIANGLE_SIDE_LENGTH) / 2 - GamePieceRenderer.TRIANGLE_SIDE_LENGTH * 2;
  const startX = numX * GamePieceRenderer.TRIANGLE_SIDE_LENGTH + offsetX;
  const startY = numY * GamePieceRenderer.TRIANGLE_HEIGHT;

  context.beginPath();
  context.moveTo(Math.floor(startX), Math.floor(startY));
  context.lineTo(Math.floor(startX + GamePieceRenderer.TRIANGLE_SIDE_LENGTH), Math.floor(startY));
  context.lineTo(Math.floor(startX + GamePieceRenderer.TRIANGLE_SIDE_LENGTH / 2), Math.floor(startY + GamePieceRenderer.TRIANGLE_HEIGHT));
  context.lineTo(Math.floor(startX), Math.floor(startY));
  context.closePath();
  context.lineWidth = 1;
  context.strokeStyle = "#666666";
  context.stroke();
}

function renderHexagonBorder() {
  const context = getContext();
  if (!context) {
    throw new Error('context isnt ready')
  }
  if (!GamePieceRenderer.TRIANGLE_SIDE_LENGTH || !GamePieceRenderer.TRIANGLE_HEIGHT) {
    throw new Error('GamePieceRenderer not ready.')
  }
  const x1 = 2 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH + OFFSET_X;
  const y1 = 0;

  const x2 = 0 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH + OFFSET_X;
  const y2 = 4 * GamePieceRenderer.TRIANGLE_HEIGHT;

  const x3 = 2 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH + OFFSET_X;
  const y3 = 8 * GamePieceRenderer.TRIANGLE_HEIGHT;

  const x4 = 6 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH + OFFSET_X;
  const y4 = 8 * GamePieceRenderer.TRIANGLE_HEIGHT;

  const x5 = 8 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH + OFFSET_X;
  const y5 = 4 * GamePieceRenderer.TRIANGLE_HEIGHT;

  const x6 = 6 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH + OFFSET_X;
  const y6 = 0;

  context.beginPath();
  context.moveTo(Math.floor(x1), Math.floor(y1));
  context.lineTo(Math.floor(x2), Math.floor(y2));
  context.lineTo(Math.floor(x3), Math.floor(y3));
  context.lineTo(Math.floor(x4), Math.floor(y4));
  context.lineTo(Math.floor(x5), Math.floor(y5));
  context.lineTo(Math.floor(x6), Math.floor(y6));

  context.closePath();
  context.lineWidth = 2;
  context.strokeStyle = "#666666";
  context.stroke();
}

function renderInnerHexagonBorder() {
  const context = getContext();
  if (!context) {
    throw new Error('context isnt ready')
  }
  if (!GamePieceRenderer.TRIANGLE_SIDE_LENGTH || !GamePieceRenderer.TRIANGLE_HEIGHT) {
    throw new Error('GamePieceRenderer not ready.')
  }
  const x1 = 4 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH - GamePieceRenderer.TRIANGLE_SIDE_LENGTH / 2 + OFFSET_X;
  const y1 = 3 * GamePieceRenderer.TRIANGLE_HEIGHT;

  const x2 = 3 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH + OFFSET_X;
  const y2 = 4 * GamePieceRenderer.TRIANGLE_HEIGHT;

  const x3 = 3 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH + GamePieceRenderer.TRIANGLE_SIDE_LENGTH / 2 + OFFSET_X;
  const y3 = 5 * GamePieceRenderer.TRIANGLE_HEIGHT;

  const x4 = 5 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH - GamePieceRenderer.TRIANGLE_SIDE_LENGTH / 2 + OFFSET_X;
  const y4 = 5 * GamePieceRenderer.TRIANGLE_HEIGHT;

  const x5 = 5 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH + OFFSET_X;
  const y5 = 4 * GamePieceRenderer.TRIANGLE_HEIGHT;

  const x6 = 5 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH - GamePieceRenderer.TRIANGLE_SIDE_LENGTH / 2 + OFFSET_X;
  const y6 = 3 * GamePieceRenderer.TRIANGLE_HEIGHT;

  context.beginPath();
  context.moveTo(Math.floor(x1), Math.floor(y1));
  context.lineTo(Math.floor(x2), Math.floor(y2));
  context.lineTo(Math.floor(x3), Math.floor(y3));
  context.lineTo(Math.floor(x4), Math.floor(y4));
  context.lineTo(Math.floor(x5), Math.floor(y5));
  context.lineTo(Math.floor(x6), Math.floor(y6));

  context.closePath();
  context.lineWidth = 2;
  context.strokeStyle = "#666666";
  context.stroke();
}

