import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';

import { Player, Room } from '../common/interfaces';
import { Logger } from '../common/logger';

type CreateGameProps = {
    connection: Map<WebSocket, string>;
    room: Room;
    idPlayer: string;
    logger: Logger;
};

export const createGame = ({ connection, room, idPlayer, logger }: CreateGameProps): void => {
    const idGame = uuidv4();

    const res = {
        type: 'create_game',
        data: JSON.stringify({
            idGame,
            idPlayer,
        }),
        id: 0,
    };

    room.players.forEach((player: Player) => {
        const playerWs = Array.from(connection.keys()).find(
            (ws) => connection.get(ws) === player.id
        );
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
