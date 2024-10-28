import WebSocket from 'ws';

import { Logger } from '../common/logger';
import { Room, Ship } from '../common/interfaces';

type StartGameProps = {
    indexPlayer: string;
    room: Room;
    connections: Map<WebSocket, string>;
    logger: Logger;
};

export const startGame = ({ indexPlayer, connections, logger, room }: StartGameProps): void => {

    const playersWithShips = room.players.filter((player) => player.ships.length > 0);

    if (playersWithShips.length < 2) {
        logger.warn(`Недостаточно игроков с добавленными кораблями в комнате с ID: ${room.id}.`);
        return;
    }
    room.players.forEach((player) => {
        const client = Array.from(connections.entries()).find(([ws, id]) => id === player.id)?.[0];
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
                    currentPlayerIndex: indexPlayer,
                }),
                id: 0,
            };
            client.send(JSON.stringify(message));
            logger.info(`Отправлено сообщение "start_game" игроку с ID: ${player.id}`);
        }
    });
};
