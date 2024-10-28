import WebSocket from 'ws';

import { AddShip, CellState, GameState } from '../common/interfaces';
import { Logger } from '../common/logger';

type AddShipProps = {
    ws: WebSocket;
    message: AddShip;
    gameState: GameState;
    connections: Map<WebSocket, string>;
    logger: Logger;
};

export const addShip = ({ connections, logger, gameState, ws, message }: AddShipProps): void => {
    const { ships, gameId, indexPlayer } = message;

    console.log(JSON.stringify({ indexPlayer, ships }));

    const room = gameState.rooms.get(gameId);
    if (!room) {
        logger.warn(`Комната с ID: ${gameId} не найдена.`);
        return;
    }

    const player = room.players.find((player) => player.id === indexPlayer);
    if (!player) {
        logger.warn(`Игрок с ID: ${indexPlayer} не найден в комнате с ID: ${gameId}.`);
        return;
    }

    ships.forEach((shipData) => {
        const { position, direction, length, type } = shipData;
        console.log(`Добавление корабля: ${type} в позицию ${JSON.stringify(position)} с направлением ${direction ? 'вертикально' : 'горизонтально'}`);

        for (let i = 0; i < length; i++) {
            const x = direction ? position.x : position.x + i;
            const y = direction ? position.y + i : position.y;

            player.gameBoard[x][y] = CellState.Ship;
            console.log(`Размещён корабль на координатах: (${x}, ${y})`);
        }

        player.ships.push({
            id: indexPlayer,
            hitPositions: [],
            position,
            direction,
            length,
            type,
        });
    });

    console.log('Игровое поле после размещения кораблей:');
    player.gameBoard.forEach((row, rowIndex) => {
        console.log(`Ряд ${rowIndex}: ${JSON.stringify(row)}`);
    });

    player.ready = true;
    logger.info(`Игрок с ID: ${indexPlayer} готов к началу игры.`);
};
