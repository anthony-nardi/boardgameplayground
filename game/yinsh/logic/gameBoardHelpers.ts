import { PLAYABLE_VERTICES_AS_MAP, RING } from "../constants";
import WindowHelper from "../rendering/WindowHelper";
import { ValidCoordinate, Direction } from "../types/types";
import GamePieceRenderer from "../rendering/gamePieceRenderer";
import { GameBoardState } from "./GameState";

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
    WindowHelper.width / 2 - 6 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH;
  const offsetYToCenter =
    WindowHelper.height / 2 - 5.5 * GamePieceRenderer.TRIANGLE_HEIGHT;

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
    (WindowHelper.width / 2 - 6 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH) /
    GamePieceRenderer.TRIANGLE_SIDE_LENGTH;
  const offsetYToCenter =
    (WindowHelper.height / 2 - 5.5 * GamePieceRenderer.TRIANGLE_HEIGHT) /
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

export function isValidEmptyCoordinate(
  coordinate: ValidCoordinate,
  gameState: GameBoardState
) {
  return !!(PLAYABLE_VERTICES_AS_MAP[coordinate] && !gameState[coordinate]);
}

export function getValidMoves(
  fromCoordinate: ValidCoordinate,
  direction: Direction,
  gameState: GameBoardState
) {
  let coordinateToCheck = fromCoordinate;
  const directionFunction = nextPiece[direction];
  const validMoves: ValidCoordinate[] = [];
  let hasJumped = false;

  for (let i = 0; i < 10; i++) {
    coordinateToCheck = directionFunction(coordinateToCheck);

    // Not a space that we can play on
    if (!PLAYABLE_VERTICES_AS_MAP[coordinateToCheck]) {
      return validMoves;
    }

    // This space is empty so we can continue
    if (isValidEmptyCoordinate(coordinateToCheck, gameState)) {
      validMoves.push(coordinateToCheck);
      if (hasJumped) {
        return validMoves;
      }
    }

    // First piece we encounter can't be stacked
    if (gameState[coordinateToCheck]) {
      if (gameState[coordinateToCheck].type === RING) {
        return validMoves;
      } else {
        hasJumped = true;
      }
    }
  }
  return validMoves;
}

export function isValidRingMovement(
  fromCoordinate: ValidCoordinate,
  toCoordinate: ValidCoordinate,
  gameState: GameBoardState
) {}

export function getValidRingMoves(
  fromCoordinate: ValidCoordinate,
  gameState: GameBoardState
) {
  return [
    getValidMoves(fromCoordinate, "w", gameState),
    getValidMoves(fromCoordinate, "e", gameState),
    getValidMoves(fromCoordinate, "nw", gameState),
    getValidMoves(fromCoordinate, "ne", gameState),
    getValidMoves(fromCoordinate, "sw", gameState),
    getValidMoves(fromCoordinate, "se", gameState),
  ].filter(isTruthy) as ValidCoordinate[][];
}

export const nextPiece = {
  w: memoize(goWest),
  e: memoize(goEast),
  nw: memoize(goNorthWest),
  ne: memoize(goNorthEast),
  sw: memoize(goSouthWest),
  se: memoize(goSouthEast),
};
