import WebSocket from 'ws';

import { CellState, GameBoard, Player, Room, Ship } from '../common/interfaces';
import { Logger } from '../common/logger';
import { getClient } from '../helpers';

type AttackProps = {
    x: number;
    y: number;
    indexPlayer: string;
    logger: Logger;
    room: Room;
    connections: Map<WebSocket, string>;
    player: Player;
};

type MarkSurroundingCellsAsMiss = {
    gameBoard: GameBoard;
    ship: Ship;
};

const markSurroundingCellsAsMiss = ({ gameBoard, ship }: MarkSurroundingCellsAsMiss): void => {
    const directions = [
        { x: -1, y: -1 },
        { x: -1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: 1, y: -1 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
    ];

    ship.hitPositions.forEach((position) => {
        directions.forEach((dir) => {
            const x = position.x + dir.x;
            const y = position.y + dir.y;

            if (y >= 0 && y < gameBoard.length && x >= 0 && x < gameBoard[0].length) {
                if (gameBoard[y][x] === CellState.Empty) {
                    gameBoard[y][x] = CellState.Miss;
                }
            }
        });
    });
};

export const attack = ({
    indexPlayer,
    x,
    y,
    logger,
    room,
    connections,
    player,
}: AttackProps): void => {
    const targetCellState = player.gameBoard[y][x];
    let status: 'miss' | 'killed' | 'shot';

    if (targetCellState === CellState.Ship) {
        player.gameBoard[y][x] = CellState.Hit;
        status = 'shot';

        const ship = player.ships.find((s) =>
            s.hitPositions.some((pos) => pos.x === x && pos.y === y)
        );

        if (ship) {
            ship.hitPositions.push({ x, y });
            if (ship.hitPositions.length === ship.length) {
                status = 'killed';
                markSurroundingCellsAsMiss({ gameBoard: player.gameBoard, ship });
            }
        }
    } else {
        player.gameBoard[y][x] = CellState.Miss;
        status = 'miss';
    }

    const attackFeedback = {
        type: 'attack',
        data: JSON.stringify({
            position: { x, y },
            indexPlayer,
            status,
        }),
    };

    const currentIndex = room.players.findIndex((p) => p.id === room.currentPlayerId);
    room.currentPlayerId = room.players[(currentIndex + 1) % room.players.length].id;

    logger.info(`Ход переходит к игроку с ID: ${room.currentPlayerId}`);

    room.players.forEach((player) => {
        const client = getClient({ player, connections });
        if (client) {
            client.send(JSON.stringify(attackFeedback));
        }
    });
};
