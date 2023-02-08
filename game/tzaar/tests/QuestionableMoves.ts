import { GamePieceRecord } from "../constants"

export function depth2GameState() {
  return {
    "7,5": false,
    "6,6": {
      "ownedBy": "PLAYER_ONE",
      "type": "TZARRA",
      "stackSize": 3,
      "isDragging": false
    },
    "5,7": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "4,8": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "8,4": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "4,0": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "3,1": false,
    "2,2": false,
    "1,3": false,
    "0,4": {
      "ownedBy": "PLAYER_TWO",
      "type": "TZAAR",
      "stackSize": 6,
      "isDragging": false
    },
    "5,0": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "4,1": {
      "ownedBy": "PLAYER_ONE",
      "type": "TZARRA",
      "stackSize": 1,
      "isDragging": false
    },
    "3,2": false,
    "2,3": {
      "ownedBy": "PLAYER_TWO",
      "type": "TZARRA",
      "stackSize": 1,
      "isDragging": false
    },
    "1,4": false,
    "0,5": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "6,0": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "5,1": false,
    "4,2": false,
    "3,3": false,
    "2,4": false,
    "1,5": {
      "ownedBy": "PLAYER_ONE",
      "type": "TZARRA",
      "stackSize": 1,
      "isDragging": false
    },
    "0,6": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "6,1": false,
    "5,2": {
      "ownedBy": "PLAYER_ONE",
      "type": "TZARRA",
      "stackSize": 2,
      "isDragging": false
    },
    "4,3": false,
    "3,4": false,
    "2,5": false,
    "1,6": {
      "ownedBy": "PLAYER_ONE",
      "type": "TZARRA",
      "stackSize": 1,
      "isDragging": false
    },
    "0,7": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "7,0": {
      "ownedBy": "PLAYER_ONE",
      "type": "TZARRA",
      "stackSize": 2,
      "isDragging": false
    },
    "6,2": {
      "ownedBy": "PLAYER_TWO",
      "type": "TZAAR",
      "stackSize": 1,
      "isDragging": false
    },
    "5,3": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "3,5": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "2,6": {
      "ownedBy": "PLAYER_TWO",
      "type": "TZARRA",
      "stackSize": 1,
      "isDragging": false
    },
    "1,7": {
      "ownedBy": "PLAYER_ONE",
      "type": "TZARRA",
      "stackSize": 1,
      "isDragging": false
    },
    "0,8": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "8,0": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "7,1": {
      "ownedBy": "PLAYER_TWO",
      "type": "TZARRA",
      "stackSize": 1,
      "isDragging": false
    },
    "6,3": {
      "ownedBy": "PLAYER_TWO",
      "type": "TZAAR",
      "stackSize": 1,
      "isDragging": false
    },
    "5,4": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "4,5": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "3,6": {
      "ownedBy": "PLAYER_TWO",
      "type": "TZAAR",
      "stackSize": 1,
      "isDragging": false
    },
    "2,7": {
      "ownedBy": "PLAYER_TWO",
      "type": "TZARRA",
      "stackSize": 1,
      "isDragging": false
    },
    "1,8": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "8,1": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "7,2": {
      "ownedBy": "PLAYER_TWO",
      "type": "TZARRA",
      "stackSize": 1,
      "isDragging": false
    },
    "6,4": false,
    "5,5": false,
    "4,6": false,
    "3,7": {
      "ownedBy": "PLAYER_ONE",
      "type": "TZARRA",
      "stackSize": 1,
      "isDragging": false
    },
    "2,8": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "8,2": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "7,3": false,
    "6,5": {
      "ownedBy": "PLAYER_ONE",
      "type": "TZAAR",
      "stackSize": 2,
      "isDragging": false
    },
    "5,6": false,
    "4,7": false,
    "3,8": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "8,3": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "7,4": false
  }

}
export function firstQuestionableMoveByAI() {
  return {
    "7,5": {
      "ownedBy": "PLAYER_ONE",
      "type": "TZARRA",
      "stackSize": 2,
      "isDragging": false
    },
    "6,6": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "5,7": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "4,8": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "8,4": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "4,0": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "3,1": false,
    "2,2": false,
    "1,3": false,
    "0,4": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "5,0": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "4,1": {
      "ownedBy": "PLAYER_ONE",
      "type": "TZARRA",
      "stackSize": 1,
      "isDragging": false
    },
    "3,2": false,
    "2,3": {
      "ownedBy": "PLAYER_TWO",
      "type": "TZAAR",
      "stackSize": 6,
      "isDragging": false
    },
    "1,4": {
      "ownedBy": "PLAYER_TWO",
      "type": "TZARRA",
      "stackSize": 1,
      "isDragging": false
    },
    "0,5": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "6,0": {
      "ownedBy": "PLAYER_ONE",
      "type": "TZARRA",
      "stackSize": 2,
      "isDragging": false
    },
    "5,1": false,
    "4,2": false,
    "3,3": false,
    "2,4": false,
    "1,5": {
      "ownedBy": "PLAYER_ONE",
      "type": "TZARRA",
      "stackSize": 1,
      "isDragging": false
    },
    "0,6": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "6,1": false,
    "5,2": false,
    "4,3": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "3,4": false,
    "2,5": false,
    "1,6": false,
    "0,7": {
      "ownedBy": "PLAYER_ONE",
      "type": "TZARRA",
      "stackSize": 2,
      "isDragging": false
    },
    "7,0": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "6,2": {
      "ownedBy": "PLAYER_TWO",
      "type": "TZAAR",
      "stackSize": 1,
      "isDragging": false
    },
    "5,3": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "3,5": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "2,6": false,
    "1,7": {
      "ownedBy": "PLAYER_ONE",
      "type": "TZARRA",
      "stackSize": 1,
      "isDragging": false
    },
    "0,8": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "8,0": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "7,1": {
      "ownedBy": "PLAYER_TWO",
      "type": "TZARRA",
      "stackSize": 1,
      "isDragging": false
    },
    "6,3": false,
    "5,4": {
      "ownedBy": "PLAYER_ONE",
      "type": "TZAAR",
      "stackSize": 2,
      "isDragging": false
    },
    "4,5": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "3,6": false,
    "2,7": {
      "ownedBy": "PLAYER_TWO",
      "type": "TZARRA",
      "stackSize": 1,
      "isDragging": false
    },
    "1,8": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "8,1": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "7,2": {
      "ownedBy": "PLAYER_TWO",
      "type": "TZARRA",
      "stackSize": 1,
      "isDragging": false
    },
    "6,4": false,
    "5,5": {
      "ownedBy": "PLAYER_ONE",
      "type": "TZARRA",
      "stackSize": 1,
      "isDragging": false
    },
    "4,6": false,
    "3,7": {
      "ownedBy": "PLAYER_TWO",
      "type": "TZARRA",
      "stackSize": 1,
      "isDragging": false
    },
    "2,8": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "8,2": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "7,3": false,
    "6,5": false,
    "5,6": {
      "ownedBy": "PLAYER_ONE",
      "type": "TZAAR",
      "stackSize": 2,
      "isDragging": false
    },
    "4,7": {
      "ownedBy": "PLAYER_TWO",
      "type": "TZARRA",
      "stackSize": 1,
      "isDragging": false
    },
    "3,8": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "8,3": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "7,4": false
  }
}

// AI turn things actually break
export function secondQuestionableMoveByAI() {
  return {
    "7,5": {
      "ownedBy": "PLAYER_ONE",
      "type": "TZARRA",
      "stackSize": 2,
      "isDragging": false
    },
    "6,6": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "5,7": false,
    "4,8": false,
    "8,4": false,
    "4,0": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "3,1": false,
    "2,2": false,
    "1,3": false,
    "0,4": {
      "ownedBy": "PLAYER_TWO",
      "type": "TZARRA",
      "stackSize": 2,
      "isDragging": false
    },
    "5,0": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "4,1": {
      "ownedBy": "PLAYER_TWO",
      "type": "TZAAR",
      "stackSize": 6,
      "isDragging": false
    },
    "3,2": false,
    "2,3": false,
    "1,4": false,
    "0,5": false,
    "6,0": false,
    "5,1": false,
    "4,2": false,
    "3,3": false,
    "2,4": false,
    "1,5": false,
    "0,6": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "6,1": false,
    "5,2": false,
    "4,3": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "3,4": false,
    "2,5": false,
    "1,6": false,
    "0,7": false,
    "7,0": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "6,2": false,
    "5,3": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "3,5": {
      "ownedBy": "PLAYER_ONE",
      "type": "TZAAR",
      "stackSize": 3,
      "isDragging": false
    },
    "2,6": false,
    "1,7": false,
    "0,8": {
      "ownedBy": "PLAYER_ONE",
      "type": "TZARRA",
      "stackSize": 4,
      "isDragging": false
    },
    "8,0": false,
    "7,1": false,
    "6,3": false,
    "5,4": false,
    "4,5": false,
    "3,6": false,
    "2,7": false,
    "1,8": false,
    "8,1": false,
    "7,2": false,
    "6,4": false,
    "5,5": false,
    "4,6": false,
    "3,7": false,
    "2,8": false,
    "8,2": {
      "ownedBy": "PLAYER_TWO",
      "type": "TOTT",
      "stackSize": 3,
      "isDragging": false
    },
    "7,3": false,
    "6,5": false,
    "5,6": {
      "ownedBy": "PLAYER_ONE",
      "type": "TZAAR",
      "stackSize": 2,
      "isDragging": false
    },
    "4,7": false,
    "3,8": false,
    "8,3": {
      "ownedBy": "PLAYER_ONE",
      "type": "TOTT",
      "stackSize": 1,
      "isDragging": false
    },
    "7,4": false
  }
}