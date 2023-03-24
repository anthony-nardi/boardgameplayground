import { PLAYER_ONE, PLAYER_TWO, PLAYABLE_VERTICES, RING } from "../constants";
import { GameBoardState } from "./GameState";
import { Player } from "../types/types";

export function getWinner(gameState: GameBoardState) {
  let playerOneRingTotal = 0;
  let playerTwoRingTotal = 0;

  for (
    let verticeIndex = 0;
    verticeIndex < PLAYABLE_VERTICES.length;
    verticeIndex++
  ) {
    const coordinate = PLAYABLE_VERTICES[verticeIndex];
    // @ts-expect-error fix
    if (gameState[coordinate] && gameState[coordinate].type === RING) {
      // @ts-expect-error fix
      if (gameState[coordinate].ownedBy === PLAYER_ONE) {
        playerOneRingTotal++;
      } else {
        playerTwoRingTotal++;
      }
    }
  }

  if (playerOneRingTotal <= 2) {
    return PLAYER_ONE;
  }
  if (playerTwoRingTotal <= 2) {
    return PLAYER_TWO;
  }

  return null;
}
