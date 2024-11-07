import WebSocket from 'ws';

import { Player, Room } from '../common/interfaces';
import { Logger } from '../common/logger';
import { getClient } from '../helpers';

type CreateGameProps = {
    connections: Map<WebSocket, string>;
    logger: Logger;
    room: Room;
    idPlayer: string;
};

export const createGame = ({ connections, logger, room, idPlayer }: CreateGameProps): void => {
    const idGame = room.id;

    room.players.forEach((player: Player) => {
        const res = {
            type: 'create_game',
            data: JSON.stringify({
                idGame,
                idPlayer: player.id,
            }),
            id: 0,
        };

        const playerWs = getClient({ player, connections });
        if (playerWs) {
            playerWs.send(JSON.stringify(res));
            logger.info(
                `Отправлено сообщение 'create_game' игроку с ID: ${player.id}, Game ID: ${idGame}`
            );
        } else {
            logger.warn(`Не удалось найти WebSocket для игрока с ID: ${player.id}`);
        }
    });
};
