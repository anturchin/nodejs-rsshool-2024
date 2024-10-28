import WebSocket from 'ws';

import { Logger } from '../common/logger';
import { Room, Ship } from '../common/interfaces';
import { getClient } from '../helpers';

type StartGameProps = {
    indexPlayer: string;
    room: Room;
    connections: Map<WebSocket, string>;
    logger: Logger;
};

export const startGame = ({ indexPlayer, connections, logger, room }: StartGameProps): void => {
    const allPlayersReady = room.players.every((player) => player.ready);

    if (!allPlayersReady) {
        logger.warn(`Не все игроки готовы в комнате с ID: ${room.id}. Игра не может начаться.`);
        return;
    }

    room.players.forEach((player) => {
        const client = getClient({ player, connections });
        if (client) {
            const message = {
                type: 'start_game',
                data: JSON.stringify({
                    ships: player.ships.map((ship: Ship) => ({
                        position: ship.position,
                        direction: ship.direction,
                        length: ship.length,
                        type: ship.type,
                    })),
                    currentPlayerIndex: room.currentPlayerId,
                }),
                id: 0,
            };
            client.send(JSON.stringify(message));
            logger.info(`Отправлено сообщение "start_game" игроку с ID: ${player.id}`);
        }
    });
};
