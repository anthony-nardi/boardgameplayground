import WindowHelper from "./WindowHelper";
import GamePieceRenderer, {
  NUMBER_OF_COLS,
  NUMBER_OF_ROWS,
} from "./gamePieceRenderer";
import { AllCoordinates } from "../types/types";

const CACHED_CANVAS = document.createElement("canvas");

const COORDS_TO_NOT_RENDER = [
  "0,0",
  "0,1",
  "0,2",
  "0,3",
  "0,4",
  "0,5",
  // "0,9",
  "0,10",
  "1,0",
  "1,1",
  "1,2",
  "1,3",
  "2,0",
  "2,1",
  "2,2",
  "3,0",
  "3,1",
  "4,0",
  "5,0",
  "5,10",
  // "9,0",
  "10,0",
  // "10,4",
  "10,5",
  "10,6",
  "10,7",
  "10,8",
  "10,9",
  "10,10",
  // "9,5",
  // "9,6",
  "9,7",
  "9,8",
  "9,9",
  "9,10",
  // "8,7",
  "8,8",
  "8,9",
  "8,10",
  // "7,8",
  "7,9",
  "7,10",
  // "6,9",
  "6,10",
] as const;

const grid = getInitialGridState();

function initCanvas() {
  CACHED_CANVAS.width = WindowHelper.width * WindowHelper.devicePixelRatio;
  CACHED_CANVAS.height = WindowHelper.height * WindowHelper.devicePixelRatio;
  CACHED_CANVAS.style.width = `${WindowHelper.width}px`;
  CACHED_CANVAS.style.height = `${WindowHelper.height}px`;

  if (!window.GAME_STATE_BOARD_CANVAS) {
    throw new Error("GAME_STATE_BOARD_CANVAS is not ready");
  }

  window.GAME_STATE_BOARD_CANVAS.width =
    WindowHelper.width * WindowHelper.devicePixelRatio;
  window.GAME_STATE_BOARD_CANVAS.height =
    WindowHelper.height * WindowHelper.devicePixelRatio;
  window.GAME_STATE_BOARD_CANVAS.style.width = `${WindowHelper.width}px`;
  window.GAME_STATE_BOARD_CANVAS.style.height = `${WindowHelper.height}px`;
  const gameStateCanvasContext = window.GAME_STATE_BOARD_CANVAS.getContext(
    "2d",
    { willReadFrequently: true }
  );
  const cachedCanvasContext = CACHED_CANVAS.getContext("2d", {
    willReadFrequently: true,
  });

  if (!cachedCanvasContext || !gameStateCanvasContext) {
    throw new Error("context isnt ready");
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

export function getInitialGridState(): AllCoordinates[] {
  const vertices: AllCoordinates[] = [];

  for (let colIndex = 0; colIndex < NUMBER_OF_COLS; colIndex++) {
    for (let rowIndex = 0; rowIndex < NUMBER_OF_ROWS; rowIndex++) {
      const coordinate = `${colIndex},${rowIndex}` as AllCoordinates;
      vertices.push(coordinate);
    }
  }

  return vertices;
}
let cachedBoardImageData: null | ImageData = null;

function getImageData() {
  if (cachedBoardImageData) {
    return cachedBoardImageData;
  }

  const context = getContext();
  if (!context || !GamePieceRenderer.TRIANGLE_SIDE_LENGTH) {
    throw new Error("context isnt ready");
  }

  cachedBoardImageData = context.getImageData(
    0,
    0,
    Math.floor(WindowHelper.devicePixelRatio * WindowHelper.width),
    Math.floor(WindowHelper.devicePixelRatio * WindowHelper.height)
  );

  return cachedBoardImageData;
}

export function drawCachedBoard() {
  const context =
    window.GAME_STATE_BOARD_CANVAS &&
    window.GAME_STATE_BOARD_CANVAS.getContext("2d", {
      willReadFrequently: true,
    });
  const imageData = getImageData();

  if (!context) {
    throw new Error("context isnt ready");
  }
  if (
    !GamePieceRenderer.TRIANGLE_SIDE_LENGTH ||
    !GamePieceRenderer.TRIANGLE_HEIGHT
  ) {
    throw new Error("GamePieceRenderer not ready.");
  }
  context.putImageData(
    imageData,
    Math.floor(
      (WindowHelper.width / 2 - GamePieceRenderer.TRIANGLE_SIDE_LENGTH * 5) *
        WindowHelper.devicePixelRatio
    ),
    Math.floor(
      (WindowHelper.height / 2 - 5.5 * GamePieceRenderer.TRIANGLE_HEIGHT) *
        WindowHelper.devicePixelRatio
    )
  );
}

export function drawInitialGrid() {
  initCanvas();
  grid.map(renderTriangleFromVertex);
  ["1,4", "0,6", "5,1", "0,10", "1,11", "5,10", "10,5", "10,0", "11,1"].map(
    renderCleanBorder
  );

  // renderHexagonBorder();
  // renderInnerHexagonBorder();
  drawCachedBoard();
}

function renderCleanBorder(coordinate: string) {
  const context = getContext();
  if (!context) {
    throw new Error("context isnt ready");
  }
  if (
    !GamePieceRenderer.TRIANGLE_SIDE_LENGTH ||
    !GamePieceRenderer.TRIANGLE_HEIGHT
  ) {
    throw new Error("GamePieceRenderer not ready.");
  }
  const [x, y] = coordinate.split(",");

  const numX = Number(x);
  const numY = Number(y);

  const offsetX =
    (numY * GamePieceRenderer.TRIANGLE_SIDE_LENGTH) / 2 -
    3 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH;
  const offsetY = 0; // GamePieceRenderer.TRIANGLE_SIDE_LENGTH * 1.5;
  const startX = numX * GamePieceRenderer.TRIANGLE_SIDE_LENGTH + offsetX;
  const startY = numY * GamePieceRenderer.TRIANGLE_HEIGHT + offsetY;

  if (coordinate === "1,4") {
    context.beginPath();

    context.moveTo(Math.floor(startX), Math.floor(startY));
    context.lineTo(
      Math.floor(startX + GamePieceRenderer.TRIANGLE_SIDE_LENGTH * 1.5),
      Math.floor(startY - 3 * GamePieceRenderer.TRIANGLE_HEIGHT)
    );
    context.stroke();
  }

  if (coordinate === "0,6" || coordinate === "5,1") {
    context.beginPath();

    context.moveTo(Math.floor(startX), Math.floor(startY));
    context.lineTo(
      Math.floor(startX + GamePieceRenderer.TRIANGLE_SIDE_LENGTH / 2),
      Math.floor(startY - 1 * GamePieceRenderer.TRIANGLE_HEIGHT)
    );
    context.stroke();
  }

  if (coordinate === "0,10" || coordinate === "5,10") {
    context.beginPath();

    context.moveTo(Math.floor(startX), Math.floor(startY));
    context.lineTo(
      Math.floor(startX + GamePieceRenderer.TRIANGLE_SIDE_LENGTH),
      Math.floor(startY)
    );
    context.stroke();
  }
  if (coordinate === "1,11") {
    context.beginPath();

    context.moveTo(Math.floor(startX), Math.floor(startY));
    context.lineTo(
      Math.floor(startX + GamePieceRenderer.TRIANGLE_SIDE_LENGTH * 3),
      Math.floor(startY)
    );
    context.stroke();
  }
  if (coordinate === "10,0" || coordinate === "10,5") {
    context.moveTo(Math.floor(startX), Math.floor(startY));
    context.lineTo(
      Math.floor(startX + GamePieceRenderer.TRIANGLE_SIDE_LENGTH / 2),
      Math.floor(startY + GamePieceRenderer.TRIANGLE_HEIGHT)
    );
    context.stroke();
  }
  if (coordinate === "11,1") {
    context.moveTo(Math.floor(startX), Math.floor(startY));
    context.lineTo(
      Math.floor(startX + GamePieceRenderer.TRIANGLE_SIDE_LENGTH * 1.5),
      Math.floor(startY + GamePieceRenderer.TRIANGLE_HEIGHT * 3)
    );
    context.stroke();
  }
}

function renderTriangleFromVertex(coordinate: AllCoordinates) {
  const context = getContext();
  if (!context) {
    throw new Error("context isnt ready");
  }
  if (COORDS_TO_NOT_RENDER.some((coord) => coord === coordinate)) {
    return;
  }
  if (
    !GamePieceRenderer.TRIANGLE_SIDE_LENGTH ||
    !GamePieceRenderer.TRIANGLE_HEIGHT
  ) {
    throw new Error("GamePieceRenderer not ready.");
  }
  const [x, y] = coordinate.split(",");

  const numX = Number(x);
  const numY = Number(y);

  const offsetX =
    (numY * GamePieceRenderer.TRIANGLE_SIDE_LENGTH) / 2 -
    3 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH;
  const offsetY = 0; // GamePieceRenderer.TRIANGLE_SIDE_LENGTH * 1.5;
  const startX = numX * GamePieceRenderer.TRIANGLE_SIDE_LENGTH + offsetX;
  const startY = numY * GamePieceRenderer.TRIANGLE_HEIGHT + offsetY;

  context.beginPath();
  context.moveTo(Math.floor(startX), Math.floor(startY));
  context.lineTo(
    Math.floor(startX + GamePieceRenderer.TRIANGLE_SIDE_LENGTH),
    Math.floor(startY)
  );
  context.lineTo(
    Math.floor(startX + GamePieceRenderer.TRIANGLE_SIDE_LENGTH / 2),
    Math.floor(startY + GamePieceRenderer.TRIANGLE_HEIGHT)
  );
  context.lineTo(Math.floor(startX), Math.floor(startY));
  context.closePath();
  context.lineWidth = 1;
  context.strokeStyle = "#666666";
  context.stroke();
  context.font = "1rem Helvetica";
  context.fillStyle = "#000";

  context.fillRect(startX + 5, startY - 5, 30, 20);

  context.fillStyle = "#fff";

  context.fillText(coordinate, startX + 10, startY + 10);
}
