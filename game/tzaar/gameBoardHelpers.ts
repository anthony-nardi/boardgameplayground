import {
  PLAYABLE_VERTICES,
  TOTT,
  TZARRA,
  NUMBER_OF_TOTTS,
  NUMBER_OF_TZARRAS,
  NUMBER_OF_TZAARS,
  TZAAR,
  PLAYER_TWO,
  PLAYER_ONE,
  PLAYABLE_VERTICES_AS_MAP,
} from "./constants";
import { List, Map, RecordOf } from "immutable";
import WindowHelper from "./WindowHelper";
import { Direction, ValidCoordinate } from "./types/types";
import GamePieceRenderer from "./gamePieceRenderer";
import { gameBoardState } from "./gameState";

const isTruthy = (arg: any) => arg;

export function getPixelCoordinatesFromBoardCoordinates(
  coordinate: ValidCoordinate
) {
  const [x, y] = coordinate.split(",");

  if (
    !GamePieceRenderer.TRIANGLE_SIDE_LENGTH ||
    !GamePieceRenderer.TRIANGLE_HEIGHT
  ) {
    throw new Error("GamePieceRenderer not ready.");
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
  return `${xPos},${yPos}`;
}

export function getBoardCoordinatesFromPixelCoordinates(
  x: number,
  y: number
): ValidCoordinate {
  if (
    !GamePieceRenderer.TRIANGLE_SIDE_LENGTH ||
    !GamePieceRenderer.TRIANGLE_HEIGHT
  ) {
    throw new Error("GamePieceRenderer not ready.");
  }
  const offsetXToCenter =
    (WindowHelper.width / 2 - 4 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH) /
    GamePieceRenderer.TRIANGLE_SIDE_LENGTH;
  const offsetYToCenter =
    (WindowHelper.height / 2 - 4 * GamePieceRenderer.TRIANGLE_HEIGHT) /
    GamePieceRenderer.TRIANGLE_HEIGHT;

  const yPos = y / GamePieceRenderer.TRIANGLE_HEIGHT - offsetYToCenter;

  const interimX = x / GamePieceRenderer.TRIANGLE_SIDE_LENGTH - offsetXToCenter;

  const offsetXBecauseY =
    (Math.abs(4 - yPos) * GamePieceRenderer.TRIANGLE_SIDE_LENGTH) /
    2 /
    GamePieceRenderer.TRIANGLE_SIDE_LENGTH;

  const offsetXBecauseAnotherY = Math.max(4 - yPos, 0);

  const xPos = interimX - offsetXBecauseY + offsetXBecauseAnotherY;

  const xCoord = Math.round(xPos);
  const yCoord = Math.round(yPos);

  return `${xCoord},${yCoord}` as ValidCoordinate;
}

function memoize(f: Function) {
  const cache: any = {};

  return (coordinate: ValidCoordinate) => {
    if (!cache[coordinate]) {
      cache[coordinate] = f(coordinate);
    }
    return cache[coordinate];
  };
}

export function goWest(coordinate: ValidCoordinate) {
  let [x, y] = coordinate.split(",");
  return `${+x - 1},${y}` as ValidCoordinate;
}

export function goEast(coordinate: ValidCoordinate) {
  let [x, y] = coordinate.split(",");
  return `${+x + 1},${y}` as ValidCoordinate;
}

export function goNorthWest(coordinate: ValidCoordinate) {
  let [x, y] = coordinate.split(",");
  return `${x},${+y - 1}` as ValidCoordinate;
}

export function goNorthEast(coordinate: ValidCoordinate) {
  let [x, y] = coordinate.split(",");
  return `${+x + 1},${+y - 1}` as ValidCoordinate;
}

export function goSouthWest(coordinate: ValidCoordinate) {
  let [x, y] = coordinate.split(",");
  return `${+x - 1},${+y + 1}` as ValidCoordinate;
}

export function goSouthEast(coordinate: ValidCoordinate) {
  let [x, y] = coordinate.split(",");
  return `${x},${+y + 1}` as ValidCoordinate;
}

export function isPlayableSpace(coordinate: ValidCoordinate) {
  return PLAYABLE_VERTICES_AS_MAP[coordinate];
}

export function setupSymmetricalBoard() {
  let piecesToDraw: {
    [key in ValidCoordinate]: any;
  } = {
    "0,4": {
      type: TOTT,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "0,5": { type: TOTT, ownedBy: PLAYER_ONE, stackSize: 1, isDragging: false },
    "0,6": { type: TOTT, ownedBy: PLAYER_ONE, stackSize: 1, isDragging: false },
    "0,7": { type: TOTT, ownedBy: PLAYER_ONE, stackSize: 1, isDragging: false },
    "0,8": { type: TOTT, ownedBy: PLAYER_ONE, stackSize: 1, isDragging: false },
    "1,3": { type: TOTT, ownedBy: PLAYER_TWO, stackSize: 1, isDragging: false },
    "1,4": {
      type: TZARRA,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "1,5": {
      type: TZARRA,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "1,6": {
      type: TZARRA,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "1,7": {
      type: TZARRA,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "1,8": { type: TOTT, ownedBy: PLAYER_TWO, stackSize: 1, isDragging: false },
    "2,2": { type: TOTT, ownedBy: PLAYER_TWO, stackSize: 1, isDragging: false },
    "2,3": {
      type: TZARRA,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "2,4": {
      type: TZAAR,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "2,5": {
      type: TZAAR,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "2,6": {
      type: TZAAR,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "2,7": {
      type: TZARRA,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "2,8": { type: TOTT, ownedBy: PLAYER_TWO, stackSize: 1, isDragging: false },
    "3,1": { type: TOTT, ownedBy: PLAYER_TWO, stackSize: 1, isDragging: false },
    "3,2": {
      type: TZARRA,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "3,3": {
      type: TZAAR,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "3,4": { type: TOTT, ownedBy: PLAYER_TWO, stackSize: 1, isDragging: false },
    "3,5": { type: TOTT, ownedBy: PLAYER_ONE, stackSize: 1, isDragging: false },
    "3,6": {
      type: TZAAR,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "3,7": {
      type: TZARRA,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "3,8": { type: TOTT, ownedBy: PLAYER_TWO, stackSize: 1, isDragging: false },
    "4,0": { type: TOTT, ownedBy: PLAYER_ONE, stackSize: 1, isDragging: false },
    "4,1": {
      type: TZARRA,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "4,2": {
      type: TZAAR,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "4,3": {
      type: TOTT,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "4,5": {
      type: TOTT,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "4,6": {
      type: TZAAR,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "4,7": {
      type: TZARRA,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "4,8": {
      type: TOTT,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "5,0": {
      type: TOTT,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "5,1": {
      type: TZARRA,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "5,2": {
      type: TZAAR,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "5,3": {
      type: TOTT,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "5,4": {
      type: TOTT,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "5,5": {
      type: TZAAR,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "5,6": {
      type: TZARRA,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "5,7": {
      type: TOTT,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "6,0": {
      type: TOTT,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "6,1": {
      type: TZARRA,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "6,2": {
      type: TZAAR,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "6,3": {
      type: TZAAR,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "6,4": {
      type: TZAAR,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "6,5": {
      type: TZARRA,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "6,6": {
      type: TOTT,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "7,0": {
      type: TOTT,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "7,1": {
      type: TZARRA,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "7,2": {
      type: TZARRA,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "7,3": {
      type: TZARRA,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "7,4": {
      type: TZARRA,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "7,5": {
      type: TOTT,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
    "8,0": {
      type: TOTT,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "8,1": {
      type: TOTT,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "8,2": {
      type: TOTT,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "8,3": {
      type: TOTT,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    },
    "8,4": {
      type: TOTT,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    },
  };
  return piecesToDraw;
}

export function canCapture(
  fromCoordinate: ValidCoordinate,
  toCoordinate: ValidCoordinate,
  gameState: typeof gameBoardState
) {
  const fromPiece = gameState[fromCoordinate];
  const toPiece = gameState[toCoordinate];

  if (!fromPiece || !toPiece) {
    return false;
  }

  return (
    fromPiece.ownedBy !== toPiece.ownedBy &&
    fromPiece.stackSize >= toPiece.stackSize
  );
}

export function canStack(
  fromCoordinate: ValidCoordinate,
  toCoordinate: ValidCoordinate,
  gameState: typeof gameBoardState
) {
  const fromPiece = gameState[fromCoordinate];
  const toPiece = gameState[toCoordinate];

  if (!fromPiece || !toPiece) {
    return false;
  }

  return fromPiece.ownedBy === toPiece.ownedBy;
}

export function isValidEmptyCoordinate(
  coordinate: ValidCoordinate,
  gameState: typeof gameBoardState
) {
  return !!(PLAYABLE_VERTICES_AS_MAP[coordinate] && !gameState[coordinate]);
}

function getNextValidCapture(
  fromCoordinate: ValidCoordinate,
  direction: Direction,
  gameState: typeof gameBoardState
) {
  let coordinateToCheck = fromCoordinate;
  const directionFunction = nextPiece[direction];

  for (let i = 0; i < 7; i++) {
    coordinateToCheck = directionFunction(coordinateToCheck);

    // Not a space that we can play on
    if (!PLAYABLE_VERTICES_AS_MAP[coordinateToCheck]) {
      return false;
    }

    // This space is empty so we can continue
    if (isValidEmptyCoordinate(coordinateToCheck, gameState)) {
      continue;
    }

    // First piece we encounter can't be stacked
    if (canCapture(fromCoordinate, coordinateToCheck, gameState)) {
      return coordinateToCheck;
    } else {
      return false;
    }
  }
  return false;
}

export function getValidStacksAndCaptures(
  fromCoordinate: ValidCoordinate,
  gameState: typeof gameBoardState
) {
  return [
    getNextValidMove(fromCoordinate, "w", gameState),
    getNextValidMove(fromCoordinate, "e", gameState),
    getNextValidMove(fromCoordinate, "nw", gameState),
    getNextValidMove(fromCoordinate, "ne", gameState),
    getNextValidMove(fromCoordinate, "sw", gameState),
    getNextValidMove(fromCoordinate, "se", gameState),
  ].filter(isTruthy) as ValidCoordinate[];
}

function getNextValidMove(
  fromCoordinate: ValidCoordinate,
  direction: Direction,
  gameState: typeof gameBoardState
) {
  let coordinateToCheck = fromCoordinate;
  const directionFunction = nextPiece[direction];

  for (let i = 0; i < 7; i++) {
    coordinateToCheck = directionFunction(coordinateToCheck);

    // Not a space that we can play on
    if (!PLAYABLE_VERTICES_AS_MAP[coordinateToCheck]) {
      return false;
    }

    // This space is empty so we can continue
    if (isValidEmptyCoordinate(coordinateToCheck, gameState)) {
      continue;
    }

    // First piece we encounter can't be stacked
    if (canStack(fromCoordinate, coordinateToCheck, gameState)) {
      return coordinateToCheck;
    } else if (canCapture(fromCoordinate, coordinateToCheck, gameState)) {
      return coordinateToCheck;
    } else {
      return false;
    }
  }
  return false;
}

function getNextValidStack(
  fromCoordinate: ValidCoordinate,
  direction: Direction,
  gameState: typeof gameBoardState
) {
  let coordinateToCheck = fromCoordinate;
  const directionFunction = nextPiece[direction];

  for (let i = 0; i < 7; i++) {
    coordinateToCheck = directionFunction(coordinateToCheck);

    // Not a space that we can play on
    if (!PLAYABLE_VERTICES_AS_MAP[coordinateToCheck]) {
      return false;
    }

    // This space is empty so we can continue
    if (isValidEmptyCoordinate(coordinateToCheck, gameState)) {
      continue;
    }

    // First piece we encounter can't be stacked
    if (!canStack(fromCoordinate, coordinateToCheck, gameState)) {
      return false;
    }
    // Finally a piece we can stack on top of
    else {
      return coordinateToCheck;
    }
  }
  return false;
}

export function getValidCaptures(
  fromCoordinate: ValidCoordinate,
  gameState: typeof gameBoardState
) {
  return [
    getNextValidCapture(fromCoordinate, "w", gameState),
    getNextValidCapture(fromCoordinate, "e", gameState),
    getNextValidCapture(fromCoordinate, "nw", gameState),
    getNextValidCapture(fromCoordinate, "ne", gameState),
    getNextValidCapture(fromCoordinate, "sw", gameState),
    getNextValidCapture(fromCoordinate, "se", gameState),
  ].filter(isTruthy) as ValidCoordinate[];
}

export function getAnyCapture(
  fromCoordinate: ValidCoordinate,
  gameState: typeof gameBoardState
) {
  return (
    getNextValidCapture(fromCoordinate, "w", gameState) ||
    getNextValidCapture(fromCoordinate, "e", gameState) ||
    getNextValidCapture(fromCoordinate, "nw", gameState) ||
    getNextValidCapture(fromCoordinate, "ne", gameState) ||
    getNextValidCapture(fromCoordinate, "sw", gameState) ||
    getNextValidCapture(fromCoordinate, "se", gameState)
  );
}

export function getValidStacks(
  fromCoordinate: ValidCoordinate,
  gameState: typeof gameBoardState
) {
  return [
    getNextValidStack(fromCoordinate, "w", gameState),
    getNextValidStack(fromCoordinate, "e", gameState),
    getNextValidStack(fromCoordinate, "nw", gameState),
    getNextValidStack(fromCoordinate, "ne", gameState),
    getNextValidStack(fromCoordinate, "sw", gameState),
    getNextValidStack(fromCoordinate, "se", gameState),
  ].filter(isTruthy) as ValidCoordinate[];
}

export function getAnyInvertedValidCaptures(
  toCoordinate: ValidCoordinate,
  gameState: typeof gameBoardState
) {
  return (
    getNextInvertedValidCapture(toCoordinate, "w", gameState) ||
    getNextInvertedValidCapture(toCoordinate, "e", gameState) ||
    getNextInvertedValidCapture(toCoordinate, "nw", gameState) ||
    getNextInvertedValidCapture(toCoordinate, "ne", gameState) ||
    getNextInvertedValidCapture(toCoordinate, "sw", gameState) ||
    getNextInvertedValidCapture(toCoordinate, "se", gameState)
  );
}

export function getInvertedValidCaptures(
  toCoordinate: ValidCoordinate,
  gameState: typeof gameBoardState
) {
  return [
    getNextInvertedValidCapture(toCoordinate, "w", gameState),
    getNextInvertedValidCapture(toCoordinate, "e", gameState),
    getNextInvertedValidCapture(toCoordinate, "nw", gameState),
    getNextInvertedValidCapture(toCoordinate, "ne", gameState),
    getNextInvertedValidCapture(toCoordinate, "sw", gameState),
    getNextInvertedValidCapture(toCoordinate, "se", gameState),
  ].filter(isTruthy) as ValidCoordinate[];
}

function getNextInvertedValidCapture(
  toCoordinate: ValidCoordinate,
  direction: Direction,
  gameState: typeof gameBoardState
) {
  let coordinateToCheck = toCoordinate;
  const directionFunction = nextPiece[direction];

  for (let i = 0; i < 7; i++) {
    coordinateToCheck = directionFunction(coordinateToCheck);

    // Not a space that we can play on
    if (!PLAYABLE_VERTICES_AS_MAP[coordinateToCheck]) {
      return false;
    }

    // This space is empty so we can continue
    if (isValidEmptyCoordinate(coordinateToCheck, gameState)) {
      continue;
    }

    if (canCapture(coordinateToCheck, toCoordinate, gameState)) {
      return coordinateToCheck;
    }
  }
  return false;
}

export const nextPiece = {
  w: memoize(goWest),
  e: memoize(goEast),
  nw: memoize(goNorthWest),
  ne: memoize(goNorthEast),
  sw: memoize(goSouthWest),
  se: memoize(goSouthEast),
};
