import {
  NUMBER_OF_COLS,
  NUMBER_OF_ROWS,
  TRIANGLE_SIDE_LENGTH,
  TRIANGLE_HEIGHT,
  CACHED_CANVAS,

  PIXEL_RATIO
} from "./constants";

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
  CACHED_CANVAS.width = window && window.innerWidth * PIXEL_RATIO();
  CACHED_CANVAS.height = window && window.innerHeight * PIXEL_RATIO();
  CACHED_CANVAS.style.width = `${window && window.innerWidth}px`;
  CACHED_CANVAS.style.height = `${window && window.innerHeight}px`;

  window.GAME_STATE_BOARD_CANVAS.width = window && window.innerWidth * PIXEL_RATIO();
  window.GAME_STATE_BOARD_CANVAS.height = window && window.innerHeight * PIXEL_RATIO();
  window.GAME_STATE_BOARD_CANVAS.style.width = `${window && window.innerWidth}px`;
  window.GAME_STATE_BOARD_CANVAS.style.height = `${window && window.innerHeight}px`;

  CACHED_CANVAS.getContext("2d").setTransform(
    PIXEL_RATIO(),
    0,
    0,
    PIXEL_RATIO(),
    0,
    0
  );
  window.GAME_STATE_BOARD_CANVAS.getContext("2d").setTransform(
    PIXEL_RATIO(),
    0,
    0,
    PIXEL_RATIO(),
    0,
    0
  );
}

function getContext() {
  return CACHED_CANVAS.getContext("2d");
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

  console.log(PIXEL_RATIO())
  return context.getImageData(
    OFFSET_X * PIXEL_RATIO(),
    0,
    PIXEL_RATIO() * (window && window.innerWidth),
    PIXEL_RATIO() * (window && window.innerHeight)
  );
}

export function drawCachedBoard() {
  const context = window.GAME_STATE_BOARD_CANVAS.getContext("2d");
  const imageData = getImageData();

  context.putImageData(
    imageData,
    (window && window.innerWidth / 2 - 4 * TRIANGLE_SIDE_LENGTH) * PIXEL_RATIO(),
    (window && window.innerHeight / 2 - 4 * TRIANGLE_HEIGHT) * PIXEL_RATIO()
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

  const offsetX = (y * TRIANGLE_SIDE_LENGTH) / 2 - TRIANGLE_SIDE_LENGTH * 2;
  const startX = x * TRIANGLE_SIDE_LENGTH + offsetX;
  const startY = y * TRIANGLE_HEIGHT;

  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(startX + TRIANGLE_SIDE_LENGTH, startY);
  context.lineTo(startX + TRIANGLE_SIDE_LENGTH / 2, startY + TRIANGLE_HEIGHT);
  context.lineTo(startX, startY);
  context.closePath();
  context.lineWidth = 1;
  context.strokeStyle = "#666666";
  context.stroke();
}

function renderHexagonBorder() {
  const context = getContext();

  const x1 = 2 * TRIANGLE_SIDE_LENGTH + OFFSET_X;
  const y1 = 0;

  const x2 = 0 * TRIANGLE_SIDE_LENGTH + OFFSET_X;
  const y2 = 4 * TRIANGLE_HEIGHT;

  const x3 = 2 * TRIANGLE_SIDE_LENGTH + OFFSET_X;
  const y3 = 8 * TRIANGLE_HEIGHT;

  const x4 = 6 * TRIANGLE_SIDE_LENGTH + OFFSET_X;
  const y4 = 8 * TRIANGLE_HEIGHT;

  const x5 = 8 * TRIANGLE_SIDE_LENGTH + OFFSET_X;
  const y5 = 4 * TRIANGLE_HEIGHT;

  const x6 = 6 * TRIANGLE_SIDE_LENGTH + OFFSET_X;
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

  const x1 = 4 * TRIANGLE_SIDE_LENGTH - TRIANGLE_SIDE_LENGTH / 2 + OFFSET_X;
  const y1 = 3 * TRIANGLE_HEIGHT;

  const x2 = 3 * TRIANGLE_SIDE_LENGTH + OFFSET_X;
  const y2 = 4 * TRIANGLE_HEIGHT;

  const x3 = 3 * TRIANGLE_SIDE_LENGTH + TRIANGLE_SIDE_LENGTH / 2 + OFFSET_X;
  const y3 = 5 * TRIANGLE_HEIGHT;

  const x4 = 5 * TRIANGLE_SIDE_LENGTH - TRIANGLE_SIDE_LENGTH / 2 + OFFSET_X;
  const y4 = 5 * TRIANGLE_HEIGHT;

  const x5 = 5 * TRIANGLE_SIDE_LENGTH + OFFSET_X;
  const y5 = 4 * TRIANGLE_HEIGHT;

  const x6 = 5 * TRIANGLE_SIDE_LENGTH - TRIANGLE_SIDE_LENGTH / 2 + OFFSET_X;
  const y6 = 3 * TRIANGLE_HEIGHT;

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
    8 * TRIANGLE_SIDE_LENGTH,
    8 * TRIANGLE_HEIGHT
  );
}
