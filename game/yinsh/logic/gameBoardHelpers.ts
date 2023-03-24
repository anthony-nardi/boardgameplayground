import {
  MARKER,
  PLAYABLE_VERTICES_AS_MAP,
  PLAYER_ONE,
  PLAYER_TWO,
  RING,
} from "../constants";
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
    WindowHelper.width / 2 - 5 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH;
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
    (WindowHelper.width / 2 - 5 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH) /
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

export function getFromToDirectionFunction(
  fromCoordinate: ValidCoordinate,
  toCoordinate: ValidCoordinate
) {
  let [x1, y1] = fromCoordinate.split(",");
  let [x2, y2] = toCoordinate.split(",");
  // @ts-expect-error fix
  x1 = +x1;
  // @ts-expect-error fix
  x2 = +x2;
  // @ts-expect-error fix
  y1 = +y1;
  // @ts-expect-error fix
  y2 = +y2;

  if (x2 > x1 && y1 === y2) {
    return goEast;
  }
  if (x2 < x1 && y1 === y2) {
    return goWest;
  }

  if (x1 === x2 && y2 > y1) {
    return goSouthEast;
  }
  if (x1 === x2 && y2 < y1) {
    return goNorthWest;
  }
  if (x2 > x1 && y2 < y1) {
    return goNorthEast;
  }
  if (x2 < x1 && y2 > y1) {
    return goSouthWest;
  }
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
  gameState: GameBoardState
) {
  const validMoves: ValidCoordinate[] = [];
  for (let j = 0; j < directions.length; j++) {
    let coordinateToCheck = fromCoordinate;
    let hasJumped = false;

    // @ts-expect-error fix
    const directionFunction = nextPiece[directions[j]];
    for (let i = 0; i < 10; i++) {
      coordinateToCheck = directionFunction(coordinateToCheck);

      // Not a space that we can play on
      if (!PLAYABLE_VERTICES_AS_MAP[coordinateToCheck]) {
        break;
      }

      // This space is empty so we can continue
      if (isValidEmptyCoordinate(coordinateToCheck, gameState)) {
        validMoves.push(coordinateToCheck);
        if (hasJumped) {
          break;
        }
      }

      // First piece we encounter can't be stacked
      if (gameState[coordinateToCheck]) {
        if (gameState[coordinateToCheck].type === RING) {
          break;
        } else {
          hasJumped = true;
        }
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
  return getValidMoves(fromCoordinate, gameState) as ValidCoordinate[];
}

const directions = ["w", "e", "nw", "ne", "sw", "se"];

export function getJumpedPieces(
  fromCoordinate: ValidCoordinate,
  toCoordinate: ValidCoordinate,
  gameState: GameBoardState
) {
  const dirFunction = getFromToDirectionFunction(fromCoordinate, toCoordinate);
  const piecesJumped: ValidCoordinate[] = [];
  let coordinate = fromCoordinate;

  while (coordinate !== toCoordinate) {
    // @ts-expect-error fix
    coordinate = dirFunction(coordinate);
    if (coordinate !== toCoordinate) {
      piecesJumped.push(coordinate);
    }
  }
  return piecesJumped;
}

const linesToCheck = [
  // W <-> E
  ["4,1", "5,1", "6,1", "7,1", "8,1", "9,1", "10,1"],
  ["3,2", "4,2", "5,2", "6,2", "7,2", "8,2", "9,2", "10,2"],
  ["2,3", "3,3", "4,3", "5,3", "6,3", "7,3", "8,3", "9,3", "10,3"],
  ["1,4", "2,4", "3,4", "4,4", "5,4", "6,4", "7,4", "8,4", "9,4", "10,4"],
  ["1,5", "2,5", "3,5", "4,5", "5,5", "6,5", "7,5", "8,5", "9,5"],
  ["0,6", "1,6", "2,6", "3,6", "4,6", "5,6", "6,6", "7,6", "8,6", "9,6"],
  ["0,7", "1,7", "2,7", "3,7", "4,7", "5,7", "6,7", "7,7", "8,7"],
  ["0,8", "1,8", "2,8", "3,8", "4,8", "5,8", "6,8", "7,8"],
  ["0,9", "1,9", "2,9", "3,9", "4,9", "5,9", "6,9"],
  // NW <-> SE
  ["1,4", "1,5", "1,6", "1,7", "1,8", "1,9", "1,10"],
  ["2,3", "2,4", "2,5", "2,6", "2,7", "2,8", "2,9", "2,10"],
  ["3,2", "3,3", "3,4", "3,5", "3,6", "3,7", "3,8", "3,9", "3,10"],
  ["4,1", "4,2", "4,3", "4,4", "4,5", "4,6", "4,7", "4,8", "4,9", "4,10"],
  ["5,1", "5,2", "5,3", "5,4", "5,5", "5,6", "5,7", "5,8", "5,9"],
  ["6,0", "6,1", "6,2", "6,3", "6,4", "6,5", "6,6", "6,7", "6,8", "6,9"],
  ["7,0", "7,1", "7,2", "7,3", "7,4", "7,5", "7,6", "7,7", "7,8"],
  ["8,0", "8,1", "8,2", "8,3", "8,4", "8,5", "8,6", "8,7"],
  ["9,0", "9,1", "9,2", "9,3", "9,4", "9,5", "9,6"],
  // SW <-> NE
  ["0,6", "1,5", "2,4", "3,3", "4,2", "5,1", "6,0"],
  ["0,7", "1,6", "2,5", "3,4", "4,3", "5,2", "6,1", "7,0"],
  ["0,8", "1,7", "2,6", "3,5", "4,4", "5,3", "6,2", "7,1", "8,0"],
  ["0,9", "1,8", "2,7", "3,6", "4,5", "5,4", "6,3", "7,2", "8,1", "9,0"],
  ["1,9", "2,8", "3,7", "4,6", "5,5", "6,4", "7,3", "8,2", "9,1"],
  ["1,10", "2,9", "3,8", "4,7", "5,6", "6,5", "7,4", "8,3", "9,2", "10,1"],
  ["2,10", "3,9", "4,8", "5,7", "6,6", "7,5", "8,4", "9,3", "10,2"],
  ["3,10", "4,9", "5,8", "6,7", "7,6", "8,5", "9,4", "10,3"],
  ["4,10", "5,9", "6,8", "7,7", "8,6", "9,5", "10,4"],
];

export function getMarkerRowsOf5(gameState: GameBoardState) {
  let fiveInARow = [];
  for (
    let linesToCheckIndex = 0;
    linesToCheckIndex < linesToCheck.length;
    linesToCheckIndex++
  ) {
    const line = linesToCheck[linesToCheckIndex];
    let previousResult = false;
    let sameMarkerInARow = 0;

    for (let lineIndex = 0; lineIndex < line.length; lineIndex++) {
      // @ts-expect-error fix
      const boardCoordinateValue = gameState[line[lineIndex]];
      if (!boardCoordinateValue || boardCoordinateValue.type === RING) {
        sameMarkerInARow = 0;
        previousResult = false;
      } else if (
        boardCoordinateValue.type === MARKER &&
        previousResult !== boardCoordinateValue.ownedBy
      ) {
        previousResult = boardCoordinateValue.ownedBy;
        sameMarkerInARow = 1;
      } else {
        sameMarkerInARow++;
      }

      // We encounter 5 in a row. Since 6 in a row is essentially two 5 in a rows,
      // we can decrement the sameMarkerInRow by 1 to hit this logic again.
      // Essentially, we need just 1 more marker in a row to trigger this condition.
      if (sameMarkerInARow === 5) {
        fiveInARow.push([
          line[lineIndex],
          line[lineIndex - 1],
          line[lineIndex - 2],
          line[lineIndex - 3],
          line[lineIndex - 4],
        ]);
        sameMarkerInARow = 4;
      }
    }
  }
  return fiveInARow;
}

export const nextPiece = {
  w: memoize(goWest),
  e: memoize(goEast),
  nw: memoize(goNorthWest),
  ne: memoize(goNorthEast),
  sw: memoize(goSouthWest),
  se: memoize(goSouthEast),
};
