import {
  PLAYABLE_VERTICES,
  GamePieceRecord,
  GamePieceRecordProps,
  TZAAR,
  TOTT,
  TZARRA,
  NUMBER_OF_TOTTS,
  NUMBER_OF_TZARRAS,
  NUMBER_OF_TZAARS,
  PLAYER_TWO,
  PLAYER_ONE
} from "./constants";
import { List, Map, RecordOf } from "immutable";
import WindowHelper from "./WindowHelper";
import { AllCoordinates, ValidCoordinate } from "./types/types";
import GamePieceRenderer from "./GamePieceRenderer";
import { gameBoardState } from "./gameState";

export function getPixelCoordinatesFromBoardCoordinates(coordinate: ValidCoordinate) {
  const [x, y] = coordinate.split(",");

  if (!GamePieceRenderer.TRIANGLE_SIDE_LENGTH || !GamePieceRenderer.TRIANGLE_HEIGHT) {
    throw new Error('GamePieceRenderer not ready.')
  }

  const offsetXToCenter = WindowHelper.width / 2 - 4 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH;
  const offsetYToCenter = WindowHelper.height / 2 - 4 * GamePieceRenderer.TRIANGLE_HEIGHT;

  const offsetX =
    +x * GamePieceRenderer.TRIANGLE_SIDE_LENGTH - Math.max(4 - +y, 0) * GamePieceRenderer.TRIANGLE_SIDE_LENGTH;

  const xPos =
    (Math.abs(4 - +y) * GamePieceRenderer.TRIANGLE_SIDE_LENGTH) / 2 + offsetX + offsetXToCenter;

  const yPos = +y * GamePieceRenderer.TRIANGLE_HEIGHT + offsetYToCenter;
  return `${xPos},${yPos}`;
}

export function getBoardCoordinatesFromPixelCoordinates(x: number, y: number): ValidCoordinate {
  if (!GamePieceRenderer.TRIANGLE_SIDE_LENGTH || !GamePieceRenderer.TRIANGLE_HEIGHT) {
    throw new Error('GamePieceRenderer not ready.')
  }
  const offsetXToCenter =
    (WindowHelper.width / 2 - 4 * GamePieceRenderer.TRIANGLE_SIDE_LENGTH) / GamePieceRenderer.TRIANGLE_SIDE_LENGTH;
  const offsetYToCenter =
    (WindowHelper.height / 2 - 4 * GamePieceRenderer.TRIANGLE_HEIGHT) / GamePieceRenderer.TRIANGLE_HEIGHT;

  const yPos = y / GamePieceRenderer.TRIANGLE_HEIGHT - offsetYToCenter;

  const interimX = x / GamePieceRenderer.TRIANGLE_SIDE_LENGTH - offsetXToCenter;

  const offsetXBecauseY =
    (Math.abs(4 - yPos) * GamePieceRenderer.TRIANGLE_SIDE_LENGTH) / 2 / GamePieceRenderer.TRIANGLE_SIDE_LENGTH;

  const offsetXBecauseAnotherY = Math.max(4 - yPos, 0);

  const xPos = interimX - offsetXBecauseY + offsetXBecauseAnotherY;

  const xCoord = Math.round(xPos);
  const yCoord = Math.round(yPos);

  return `${xCoord},${yCoord}` as ValidCoordinate;
}

export function goWest(coordinate: ValidCoordinate) {
  let [x, y] = coordinate.split(",");
  return `${+x - 1},${y}` as ValidCoordinate
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
  return PLAYABLE_VERTICES.includes(coordinate);
}

export function setupBoardWithPiecesNotRandom() {
  let piecesToDraw: { [key in ValidCoordinate]: RecordOf<GamePieceRecordProps> } = {
    "0,4": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
    "0,5": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
    "0,6": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
    "0,7": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
    "0,8": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
    "1,3": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
    "1,4": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
    "1,5": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
    "1,6": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
    "1,7": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
    "1,8": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
    "2,2": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
    "2,3": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
    "2,4": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_TWO }),
    "2,5": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_ONE }),
    "2,6": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_ONE }),
    "2,7": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
    "2,8": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
    "3,1": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
    "3,2": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
    "3,3": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_TWO }),
    "3,4": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
    "3,5": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
    "3,6": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_TWO }),
    "3,7": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
    "3,8": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
    "4,0": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
    "4,1": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
    "4,2": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_ONE }),
    "4,3": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
    "4,5": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
    "4,6": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_TWO }),
    "4,7": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
    "4,8": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
    "5,0": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
    "5,1": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
    "5,2": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_ONE }),
    "5,3": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
    "5,4": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
    "5,5": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_ONE }),
    "5,6": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
    "5,7": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
    "6,0": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
    "6,1": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
    "6,2": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_TWO }),
    "6,3": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_TWO }),
    "6,4": new GamePieceRecord({ type: TZAAR, ownedBy: PLAYER_ONE }),
    "6,5": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
    "6,6": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
    "7,0": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
    "7,1": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
    "7,2": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
    "7,3": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_TWO }),
    "7,4": new GamePieceRecord({ type: TZARRA, ownedBy: PLAYER_ONE }),
    "7,5": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
    "8,0": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
    "8,1": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
    "8,2": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
    "8,3": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_TWO }),
    "8,4": new GamePieceRecord({ type: TOTT, ownedBy: PLAYER_ONE }),
  }
  return piecesToDraw;
}

export function setupBoardWithPieces() {
  let piecesToDraw = Map();
  let PLAYER_ONE_PIECES = List();
  let PLAYER_TWO_PIECES = List();

  for (let i = 0; i < NUMBER_OF_TOTTS; i++) {
    PLAYER_ONE_PIECES = PLAYER_ONE_PIECES.push(
      new GamePieceRecord({ type: TOTT, ownedBy: "PLAYER_ONE" })
    );
    PLAYER_TWO_PIECES = PLAYER_TWO_PIECES.push(
      new GamePieceRecord({ type: TOTT, ownedBy: "PLAYER_TWO" })
    );
  }

  for (let i = 0; i < NUMBER_OF_TZARRAS; i++) {
    PLAYER_ONE_PIECES = PLAYER_ONE_PIECES.push(
      new GamePieceRecord({ type: TZARRA, ownedBy: "PLAYER_ONE" })
    );
    PLAYER_TWO_PIECES = PLAYER_TWO_PIECES.push(
      new GamePieceRecord({ type: TZARRA, ownedBy: "PLAYER_TWO" })
    );
  }

  for (let i = 0; i < NUMBER_OF_TZAARS; i++) {
    PLAYER_ONE_PIECES = PLAYER_ONE_PIECES.push(
      new GamePieceRecord({ type: TZAAR, ownedBy: "PLAYER_ONE" })
    );
    PLAYER_TWO_PIECES = PLAYER_TWO_PIECES.push(
      new GamePieceRecord({ type: TZAAR, ownedBy: "PLAYER_TWO" })
    );
  }

  const allGamePieces = PLAYER_ONE_PIECES.concat(PLAYER_TWO_PIECES);
  const shuffledPieces = allGamePieces.sortBy(Math.random);

  shuffledPieces.forEach((piece, index) => {
    piecesToDraw = piecesToDraw.set(PLAYABLE_VERTICES[index], piece);
    // setNewgameBoardState(gameBoardState.set(PLAYABLE_VERTICES[index], piece));
  });
  return piecesToDraw.sortBy(Math.random);
}

export function canCapture(fromCoordinate: ValidCoordinate, toCoordinate: ValidCoordinate, gameState: typeof gameBoardState) {
  const fromPiece = gameState.get(fromCoordinate)
  const toPiece = gameState.get(toCoordinate)

  if (!fromPiece || !toPiece) {
    return false
  }

  return (
    fromPiece.ownedBy !== toPiece.ownedBy &&
    fromPiece.stackSize >= toPiece.stackSize
  );
}

export function canStack(fromCoordinate: ValidCoordinate, toCoordinate: ValidCoordinate, gameState: typeof gameBoardState) {
  const fromPiece = gameState.get(fromCoordinate)
  const toPiece = gameState.get(toCoordinate)

  if (!fromPiece || !toPiece) {
    return false
  }

  return fromPiece.ownedBy === toPiece.ownedBy;
}

export function isValidEmptyCoordinate(coordinate: ValidCoordinate, gameState: typeof gameBoardState) {
  return Boolean(
    PLAYABLE_VERTICES.includes(coordinate) && !gameState.get(coordinate)
  );
}

function getNextValidCapture(fromCoordinate: ValidCoordinate, direction: 'w' | 'e' | 'sw' | 'se' | 'nw' | 'ne', gameState: typeof gameBoardState) {
  let nextMove;
  let coordinateToCheck = fromCoordinate;
  while (nextMove === undefined) {
    coordinateToCheck = nextPiece[direction](coordinateToCheck);

    // Not a space that we can play on
    if (!isPlayableSpace(coordinateToCheck)) {
      nextMove = false;
    }

    // This space is empty so we can continue
    else if (isValidEmptyCoordinate(coordinateToCheck, gameState)) {
      nextMove = undefined;
    }

    // First piece we encounter can't be captured
    else if (!canCapture(fromCoordinate, coordinateToCheck, gameState)) {
      nextMove = false;
    }
    // Finally a piece we can capture
    else {
      nextMove = coordinateToCheck;
    }
  }
  return nextMove;
}

function getNextValidStack(fromCoordinate: ValidCoordinate, direction: 'w' | 'e' | 'sw' | 'se' | 'nw' | 'ne', gameState: typeof gameBoardState) {
  let nextMove;
  let coordinateToCheck = fromCoordinate;
  while (nextMove === undefined) {
    coordinateToCheck = nextPiece[direction](coordinateToCheck);

    // Not a space that we can play on
    if (!isPlayableSpace(coordinateToCheck)) {
      nextMove = false;
    }

    // This space is empty so we can continue
    else if (isValidEmptyCoordinate(coordinateToCheck, gameState)) {
      nextMove = undefined;
    }

    // First piece we encounter can't be captured
    else if (!canStack(fromCoordinate, coordinateToCheck, gameState)) {
      nextMove = false;
    }
    // Finally a piece we can capture
    else {
      nextMove = coordinateToCheck;
    }
  }
  return nextMove;
}

export function getValidCaptures(fromCoordinate: ValidCoordinate, gameState: typeof gameBoardState) {
  return List([
    getNextValidCapture(fromCoordinate, "w", gameState),
    getNextValidCapture(fromCoordinate, "e", gameState),
    getNextValidCapture(fromCoordinate, "nw", gameState),
    getNextValidCapture(fromCoordinate, "ne", gameState),
    getNextValidCapture(fromCoordinate, "sw", gameState),
    getNextValidCapture(fromCoordinate, "se", gameState)
  ]).filter(isValidMove => isValidMove);
}

export function getValidStacks(fromCoordinate: ValidCoordinate, gameState: typeof gameBoardState) {
  return List([
    getNextValidStack(fromCoordinate, "w", gameState),
    getNextValidStack(fromCoordinate, "e", gameState),
    getNextValidStack(fromCoordinate, "nw", gameState),
    getNextValidStack(fromCoordinate, "ne", gameState),
    getNextValidStack(fromCoordinate, "sw", gameState),
    getNextValidStack(fromCoordinate, "se", gameState)
  ]).filter(isValidMove => isValidMove);
}
export function getInvertedValidCaptures(toCoordinate: ValidCoordinate, gameState: typeof gameBoardState) {
  return List([
    getNextInvertedValidCapture(toCoordinate, "w", gameState),
    getNextInvertedValidCapture(toCoordinate, "e", gameState),
    getNextInvertedValidCapture(toCoordinate, "nw", gameState),
    getNextInvertedValidCapture(toCoordinate, "ne", gameState),
    getNextInvertedValidCapture(toCoordinate, "sw", gameState),
    getNextInvertedValidCapture(toCoordinate, "se", gameState)
  ]).filter(isValidMove => isValidMove);
}

function getNextInvertedValidCapture(toCoordinate: ValidCoordinate, direction: 'w' | 'e' | 'sw' | 'se' | 'nw' | 'ne', gameState: typeof gameBoardState) {
  let nextMove;
  let coordinateToCheck = toCoordinate;
  while (nextMove === undefined) {
    coordinateToCheck = nextPiece[direction](coordinateToCheck);

    // Not a space that we can play on
    if (!isPlayableSpace(coordinateToCheck)) {
      nextMove = false;
    }

    // This space is empty so we can continue
    else if (isValidEmptyCoordinate(coordinateToCheck, gameState)) {
      nextMove = undefined;
    }

    // First piece we encounter can't be captured
    else if (!canCapture(coordinateToCheck, toCoordinate, gameState)) {
      nextMove = false;
    }
    // Finally a piece we can capture
    else {
      nextMove = coordinateToCheck;
    }
  }
  return nextMove;
}

export const nextPiece = {
  w: goWest,
  e: goEast,
  nw: goNorthWest,
  ne: goNorthEast,
  sw: goSouthWest,
  se: goSouthEast
};
