import { List, Map, RecordOf } from "immutable";
import {
    TZAAR,
    TOTT,
    TZARRA,
    PLAYER_ONE,
    PLAYER_TWO,
    CORNER_COORDINATES,
    EDGE_COORDINATES,
    GamePieceRecordProps,
} from "./constants";
import { currentTurn, gameBoardState } from "./gameState";
import { Player, ValidCoordinate } from "./types/types";
import {
    getValidCaptures,
} from "./gameBoardHelpers";

const scoringMapRecord = Map({
    [PLAYER_ONE]: Map({
        [TOTT]: Map({
            count: 0,
            stacksGreaterThanOne: 0,
            largestStackSize: 0,
            stacksOnEdge: 0,
            stacksOnCorner: 0,
            coordinate: null,
        }),
        [TZARRA]: Map({
            count: 0,
            stacksGreaterThanOne: 0,
            largestStackSize: 0,
            stacksOnEdge: 0,
            stacksOnCorner: 0,
            coordinate: null,
        }),
        [TZAAR]: Map({
            count: 0,
            stacksGreaterThanOne: 0,
            largestStackSize: 0,
            stacksOnEdge: 0,
            stacksOnCorner: 0,
            coordinate: null,
        }),
    }),
    [PLAYER_TWO]: Map({
        [TOTT]: Map({
            count: 0,
            stacksGreaterThanOne: 0,
            largestStackSize: 0,
            stacksOnEdge: 0,
            stacksOnCorner: 0,
            coordinate: null,
        }),
        [TZARRA]: Map({
            count: 0,
            stacksGreaterThanOne: 0,
            largestStackSize: 0,
            stacksOnEdge: 0,
            stacksOnCorner: 0,
            coordinate: null,
        }),
        [TZAAR]: Map({
            count: 0,
            stacksGreaterThanOne: 0,
            largestStackSize: 0,
            stacksOnEdge: 0,
            stacksOnCorner: 0,
            coordinate: null,
        }),
    }),
});

function getScoreForHighestStack(currentStack: number, stackToBeat: number) {
    if (currentStack > stackToBeat) {
        return 20;
    }

    if (currentStack < stackToBeat) {
        return -20;
    }

    return 0;
}

function getScoreForEdgesAndCorners(edges: number, corners: number) {
    return edges * 5 + corners * 10;
}

export function getGameStateScore(gameState: typeof gameBoardState) {

    const scoringMap = gameState.reduce((piecesByPlayer, piece, coordinate: ValidCoordinate) => {
        if (!piece) {
            return piecesByPlayer;
        }

        const { ownedBy, type, stackSize } = piece;
        return piecesByPlayer
            // @ts-expect-error fix
            .updateIn([ownedBy, type, "count"], (count: number) => count + 1)
            .updateIn(
                [ownedBy, type, "stacksGreaterThanOne"],// @ts-expect-error fix

                (stacks: number) => stacks + Number(stackSize)
            )
            // @ts-expect-error fix
            .updateIn([ownedBy, type, "largestStackSize"], (largestStackSize: number) =>
                Math.max(largestStackSize, Number(stackSize))
            )
            // @ts-expect-error fix
            .updateIn([ownedBy, type, "stacksOnEdge"], (stacksOnEdge: number) => {
                // @ts-expect-error fix
                if (stackSize > 1 && EDGE_COORDINATES.includes(coordinate)) {
                    return stacksOnEdge + 1;
                }
                return stacksOnEdge;
            })
            // @ts-expect-error fix
            .updateIn([ownedBy, type, "stacksOnCorner"], (stacksOnCorner: number) => {
                // @ts-expect-error fix
                if (stackSize > 1 && CORNER_COORDINATES.includes(coordinate)) {
                    return stacksOnCorner + 1;
                }
                return stacksOnCorner;
            })
            .setIn([ownedBy, type, "coordinate"], coordinate);
    }, scoringMapRecord);

    let score = 0;
    // @ts-expect-error fix
    scoringMap.get(PLAYER_ONE).forEach((data, pieceType: typeof TZAAR | typeof TZARRA | typeof TOTT) => {
        score =
            score -
            // @ts-expect-error fix
            getScoreForStacks(data.get("count"), data.get("stacksGreaterThanOne")) -
            getScoreForHighestStack(
                // @ts-expect-error fix
                data.get("largestStackSize"),
                scoringMap.getIn([PLAYER_TWO, pieceType, "largestStackSize"])
            ) +
            getScoreForEdgesAndCorners(
                // @ts-expect-error fix
                data.get("stacksOnEdge"),
                data.get("stacksOnCorner")
            );
    });
    // @ts-expect-error fix
    scoringMap.get(PLAYER_TWO).forEach((data, pieceType: typeof TZAAR | typeof TZARRA | typeof TOTT) => {
        score =
            score +
            // @ts-expect-error fix
            getScoreForStacks(data.get("count"), data.get("stacksGreaterThanOne")) +
            getScoreForHighestStack(// @ts-expect-error fix
                data.get("largestStackSize"),
                scoringMap.getIn([PLAYER_ONE, pieceType, "largestStackSize"])
            ) -
            getScoreForEdgesAndCorners(
                // @ts-expect-error fix
                data.get("stacksOnEdge"),
                data.get("stacksOnCorner")
            );
    });

    return score;
}

// we value stacks depending on how many of that type are on the board
function getScoreForStacks(numberOfPieces: number, stackSize: number) {
    const MULTIPLIER = 15;

    return (MULTIPLIER - numberOfPieces) * stackSize;
}


function getPieces(gameState: typeof gameBoardState) {
    return gameState.reduce(
        (piecesByPlayer, piece) => {
            if (!piece) {
                return piecesByPlayer;
            }
            const { ownedBy, type } = piece;
            return piecesByPlayer.updateIn([ownedBy, type], (pieces: any) =>
                pieces.push(piece)
            );
        },
        Map({
            [PLAYER_ONE]: Map({
                [TOTT]: List<RecordOf<GamePieceRecordProps>>(),
                [TZARRA]: List<RecordOf<GamePieceRecordProps>>(),
                [TZAAR]: List<RecordOf<GamePieceRecordProps>>(),
            }),
            [PLAYER_TWO]: Map({
                [TOTT]: List<RecordOf<GamePieceRecordProps>>(),
                [TZARRA]: List<RecordOf<GamePieceRecordProps>>(),
                [TZAAR]: List<RecordOf<GamePieceRecordProps>>(),
            }),
        })
    );
}

export function getWinner(gameState: typeof gameBoardState) {
    const pieceCountsByPlayer = getPieces(gameState);


    const playerOneLost =
        // @ts-expect-error fix
        !pieceCountsByPlayer.getIn([PLAYER_ONE, TOTT]).size ||
        // @ts-expect-error fix
        !pieceCountsByPlayer.getIn([PLAYER_ONE, TZARRA]).size ||
        // @ts-expect-error fix
        !pieceCountsByPlayer.getIn([PLAYER_ONE, TZAAR]).size;

    const playerTwoLost =
        // @ts-expect-error fix
        !pieceCountsByPlayer.getIn([PLAYER_TWO, TOTT]).size ||
        // @ts-expect-error fix
        !pieceCountsByPlayer.getIn([PLAYER_TWO, TZARRA]).size ||
        // @ts-expect-error fix
        !pieceCountsByPlayer.getIn([PLAYER_TWO, TZAAR]).size;

    if (playerOneLost) {
        return PLAYER_TWO;
    }
    if (playerTwoLost) {
        return PLAYER_ONE;
    }

    const possibleCaptures = getAllPlayerPieceCoordinates(
        gameState,// @ts-expect-error fix
        currentTurn
    ).map((fromCoordinate) => {
        return getValidCaptures(fromCoordinate, gameState);
    });
    // @ts-expect-error fix
    if (!possibleCaptures.find((possibleCapture) => possibleCapture.size)) {
        return currentTurn === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
    }
}


export function getAllPlayerPieceCoordinates(gameState: typeof gameBoardState, player: Player) {
    return gameState
        .filter((piece) => piece && piece.ownedBy === player)
        .keySeq();
}
// @ts-expect-error fix
export function getAllPlayerPieceCoordinatesByType(gameState: typeof gameBoardState, player: Player, type) {
    return gameState
        .filter((piece) => piece && piece.ownedBy === player && piece.type === type)
        .keySeq();
}