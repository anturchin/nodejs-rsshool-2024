import WebSocket from 'ws';

import { Room } from '../common/interfaces';
import { Logger } from '../common/logger';
import { getClient } from '../helpers';

type TurnProps = {
    room: Room;
    currentPlayer: string;
    connections: Map<WebSocket, string>;
    logger: Logger;
};

export const sendTurnUpdate = ({ room, currentPlayer, connections, logger }: TurnProps): void => {
    room.players.forEach((player) => {
        const client = getClient({ player, connections });
        if (client) {
            const message = {
                type: 'turn',
                data: JSON.stringify({
                    currentPlayer,
                }),
                id: 0,
            };
            client.send(JSON.stringify(message));
            logger.info(
                `Отправлено сообщение "turn" игроку с ID: ${player.id}, текущий ход у игрока ID: ${currentPlayer}`
            );
        }
    });
};
