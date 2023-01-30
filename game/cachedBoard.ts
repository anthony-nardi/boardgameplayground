import {
  CACHED_CANVAS,

} from "./constants";
import WindowHelper from "./WindowHelper";
import GamePieceRenderer, { NUMBER_OF_COLS, NUMBER_OF_ROWS } from "./GamePieceRenderer";

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
];

const OFFSET_X = 0;

const grid = getInitialGridState();

function initCanvas() {
  console.log(WindowHelper)

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
  console.log(WindowHelper.width * WindowHelper.devicePixelRatio)
  console.log(WindowHelper.width)

  CACHED_CANVAS.getContext("2d", { willReadFrequently: true }).setTransform(
    WindowHelper.devicePixelRatio,
    0,
    0,
    WindowHelper.devicePixelRatio,
    0,
    0
  );
  window.GAME_STATE_BOARD_CANVAS.getContext("2d", { willReadFrequently: true }).setTransform(
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

function getInitialGridState() {
  const vertices = [];

  for (let colIndex = 0; colIndex < NUMBER_OF_COLS; colIndex++) {
    for (let rowIndex = 0; rowIndex < NUMBER_OF_ROWS; rowIndex++) {
      vertices.push(`${colIndex},${rowIndex}`);
    }
  }

  return vertices;
}

function getImageData() {
  const context = getContext();

  return context.getImageData(
    OFFSET_X * WindowHelper.devicePixelRatio,
    0,
    WindowHelper.devicePixelRatio * (WindowHelper.width),
    WindowHelper.devicePixelRatio * (WindowHelper.height)
  );
}

export function drawCachedBoard() {
  const context = window.GAME_STATE_BOARD_CANVAS.getContext("2d", { willReadFrequently: true });
  const imageData = getImageData();

  console.log(GamePieceRenderer.TRIANGLE_SIDE_LENGTH)

  context.putImageData(
    imageData,
    (WindowHelper.width / 2 - 4 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH) * WindowHelper.devicePixelRatio,
    (WindowHelper.height / 2 - 4 * GamePieceRenderer.TRIANGLE_HEIGHT) * WindowHelper.devicePixelRatio
  );
}

export function drawInitialGrid() {
  initCanvas();
  grid.map(renderTriangleFromVertex);
  renderHexagonBorder();
  renderInnerHexagonBorder();
  drawCachedBoard();
}

function renderTriangleFromVertex(coordinate) {
  const context = getContext();

  if (COORDS_TO_NOT_RENDER.includes(coordinate)) {
    return;
  }
  const [x, y] = coordinate.split(",");

  const offsetX = (y * GamePieceRenderer.TRIANGLE_SIDE_LENGTH) / 2 - GamePieceRenderer.TRIANGLE_SIDE_LENGTH * 2;
  const startX = x * GamePieceRenderer.TRIANGLE_SIDE_LENGTH + offsetX;
  const startY = y * GamePieceRenderer.TRIANGLE_HEIGHT;

  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(startX + GamePieceRenderer.TRIANGLE_SIDE_LENGTH, startY);
  context.lineTo(startX + GamePieceRenderer.TRIANGLE_SIDE_LENGTH / 2, startY + GamePieceRenderer.TRIANGLE_HEIGHT);
  context.lineTo(startX, startY);
  context.closePath();
  context.lineWidth = 1;
  context.strokeStyle = "#666666";
  context.stroke();
}

function renderHexagonBorder() {
  const context = getContext();

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
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.lineTo(x3, y3);
  context.lineTo(x4, y4);
  context.lineTo(x5, y5);
  context.lineTo(x6, y6);

  context.closePath();
  context.lineWidth = 2;
  context.strokeStyle = "#666666";
  context.stroke();
}

function renderInnerHexagonBorder() {
  const context = getContext();

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
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.lineTo(x3, y3);
  context.lineTo(x4, y4);
  context.lineTo(x5, y5);
  context.lineTo(x6, y6);

  context.closePath();
  context.lineWidth = 2;
  context.strokeStyle = "#666666";
  context.stroke();
}

function renderSquareBorder() {
  const context = getContext();
  context.strokeRect(
    OFFSET_X,
    0,
    8 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH,
    8 * GamePieceRenderer.TRIANGLE_HEIGHT
  );
}
