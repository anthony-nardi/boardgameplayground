import { Record } from "immutable";
import { PieceType, ValidCoordinate } from "./types/types";

export const NUMBER_OF_TOTTS = 15;
export const NUMBER_OF_TZARRAS = 9;
export const NUMBER_OF_TZAARS = 6;
export const PLAYABLE_VERTICES: ValidCoordinate[] = [
  "4,0",
  "5,0",
  "6,0",
  "7,0",
  "8,0",
  "3,1",
  "4,1",
  "5,1",
  "6,1",
  "7,1",
  "8,1",
  "2,2",
  "3,2",
  "4,2",
  "5,2",
  "6,2",
  "7,2",
  "8,2",
  "1,3",
  "2,3",
  "3,3",
  "4,3",
  "5,3",
  "6,3",
  "7,3",
  "8,3",
  "0,4",
  "1,4",
  "2,4",
  "3,4",
  "5,4",
  "6,4",
  "7,4",
  "8,4",
  "0,5",
  "1,5",
  "2,5",
  "3,5",
  "4,5",
  "5,5",
  "6,5",
  "7,5",
  "0,6",
  "1,6",
  "2,6",
  "3,6",
  "4,6",
  "5,6",
  "6,6",
  "0,7",
  "1,7",
  "2,7",
  "3,7",
  "4,7",
  "5,7",
  "0,8",
  "1,8",
  "2,8",
  "3,8",
  "4,8"
];

export const CORNER_COORDINATES = ["4,0", "8,0", "8,4", "4,8", "0,8", "0,4"] as const
export const EDGE_COORDINATES = [
  "5,0",
  "6,0",
  "7,0",
  "8,1",
  "8,2",
  "8,3",
  "7,5",
  "6,6",
  "5,7",
  "3,8",
  "2,8",
  "1,8",
  "0,7",
  "0,6",
  "0,5",
  "1,3",
  "2,2",
  "3,1"
] as const

export const TZAAR = "TZAAR";
export const TOTT = "TOTT";
export const TZARRA = "TZARRA";

export type GamePieceRecordProps = {
  ownedBy: typeof PLAYER_ONE | typeof PLAYER_TWO | null;
  type: PieceType | null;
  stackSize: number;
  isDragging: boolean
}

export const GamePieceRecord = Record<GamePieceRecordProps>({
  ownedBy: null,
  type: null,
  stackSize: 1,
  isDragging: false
});

export const PLAYER_ONE = "PLAYER_ONE"
export const PLAYER_TWO = "PLAYER_TWO";

export const TURN_PHASES = {
  CAPTURE: "CAPTURE",
  STACK_OR_CAPTURE_OR_PASS: "STACK_OR_CAPTURE_OR_PASS"
};