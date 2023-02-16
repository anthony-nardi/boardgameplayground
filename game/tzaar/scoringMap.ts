import { Record, RecordOf } from "immutable";
import { TZAAR, TOTT, TZARRA, PLAYER_ONE, PLAYER_TWO } from "./constants";

export type PieceRecordProps = {
  count: number;
  stacksGreaterThanOne: number;
  largestStackSize: number;
  stacksOnEdge: number;
  stacksOnCorner: number;
  stacksThreatened: number;
  stackValue: number
};

export type PlayerPiecesProps = {
  [TOTT]: RecordOf<PieceRecordProps>;
  [TZAAR]: RecordOf<PieceRecordProps>;
  [TZARRA]: RecordOf<PieceRecordProps>;
};

export type ScoringMapProps = {
  [PLAYER_ONE]: RecordOf<PlayerPiecesProps>;
  [PLAYER_TWO]: RecordOf<PlayerPiecesProps>;
};

const PlayerPieceRecord = Record<PieceRecordProps>({
  count: 0,
  stacksGreaterThanOne: 0,
  largestStackSize: 0,
  stacksOnEdge: 0,
  stacksOnCorner: 0,
  stacksThreatened: 0,
  stackValue: 0
});

const PlayerPiecesRecord = Record<PlayerPiecesProps>({
  [TOTT]: new PlayerPieceRecord(),
  [TZARRA]: new PlayerPieceRecord(),
  [TZAAR]: new PlayerPieceRecord(),
});

export const scoringMapRecord = Record<ScoringMapProps>({
  [PLAYER_ONE]: new PlayerPiecesRecord(),
  [PLAYER_TWO]: new PlayerPiecesRecord(),
});
