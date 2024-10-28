import WebSocket from 'ws';

import { AddShip, GameState, Message, Ship } from '../common/interfaces';
import { Logger } from '../common/logger';

type AddShipProps = {
    ws: WebSocket;
    message: Message;
    gameState: GameState;
    connections: Map<WebSocket, string>;
    logger: Logger;
};

export const addShip = ({ connections, logger, gameState, ws, message }: AddShipProps): void => {
    const { ships, gameId, indexPlayer } = JSON.parse(message.data) as AddShip;

    const room = Array.from(gameState.rooms.values()).find((room) => room.id === gameId);
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
        const ship: Ship = {
            id: indexPlayer,
            hitPositions: [],
            position: shipData.position,
            direction: shipData.direction,
            length: shipData.length,
            type: shipData.type,
        };
        player.ships.push(ship);
        logger.info(
            `Корабль типа "${ship.type}" добавлен игроку с ID: ${indexPlayer} в комнате с ID: ${gameId}.`
        );
    });
};
