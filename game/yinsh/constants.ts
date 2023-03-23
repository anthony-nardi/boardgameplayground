import { ValidCoordinate } from "./types/types";

const AI_NORMAL_ANIMATION_DURATION = 2000;
const AI_FAST_ANIMATION_DURATION = 1000;
const AI_VERY_FAST_ANIMATION_DURATION = 100;
export const AI_ANIMATION_DURATION = AI_FAST_ANIMATION_DURATION;
export const NUMBER_OF_TOTTS = 15;
export const NUMBER_OF_TZARRAS = 9;
export const NUMBER_OF_TZAARS = 6;
export const PLAYABLE_VERTICES: ValidCoordinate[] = [
  "6,0",
  "7,0",
  "8,0",
  "9,0",
  "4,1",

  "7,8",
  "5,9",
  "9,6",
  "5,1",
  "6,1",
  "7,1",
  "8,1",
  "9,1",
  "10,1",
  "3,2",
  "4,2",
  "5,2",
  "6,2",
  "7,2",
  "8,2",
  "9,2",
  "10,2",
  "2,3",
  "3,3",
  "4,3",
  "5,3",
  "6,3",
  "7,3",
  "8,3",
  "9,3",
  "10,3",
  "1,4",
  "2,4",
  "3,4",
  "4,4",
  "5,4",
  "6,4",
  "7,4",
  "8,4",
  "9,4",
  "10,4",
  "1,5",
  "2,5",
  "3,5",
  "4,5",
  "5,5",
  "6,5",
  "7,5",
  "8,5",
  "9,5",
  "10,5",
  "0,6",
  "1,6",
  "2,6",
  "3,6",
  "4,6",
  "5,6",
  "6,6",
  "7,6",
  "8,6",
  "0,7",
  "1,7",
  "2,7",
  "3,7",
  "4,7",
  "5,7",
  "6,7",
  "7,7",
  "9,7",
  "0,8",
  "1,8",
  "2,8",
  "3,8",
  "4,8",
  "5,8",
  "6,8",
  "8,8",
  "0,9",
  "1,9",
  "2,9",
  "3,9",
  "4,9",
  "5,9",
  "6,9",
  "8,7",
  "0,10",
  "1,10",
  "2,10",
  "3,10",
  "4,10",
  "6,10",
];

export const PLAYABLE_VERTICES_AS_MAP = PLAYABLE_VERTICES.reduce(
  (map: any, coordinate) => {
    map[coordinate] = true;
    return map;
  },
  {}
);

export const RING = "RING";
export const MARKER = "MARKER";

export const PLAYER_ONE = "PLAYER_ONE" as const;
export const PLAYER_TWO = "PLAYER_TWO" as const;
export const RING_PLACEMENT = "RING_PLACEMENT" as const;
export const RING_MOVEMENT = "RING_MOVEMENT" as const;
export const PHASES = {
  RING_PLACEMENT,
  RING_MOVEMENT,
};
