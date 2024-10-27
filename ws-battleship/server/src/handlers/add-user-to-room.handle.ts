import WebSocket from 'ws';

import { GameState, Message, UserToRoom } from '../common/interfaces';
import { Logger } from '../common/logger';
import { sendUpdateRoom } from './send-update-room.handle';
import { createGame } from './create-game.handle';

type AddUserToRoomProps = {
    ws: WebSocket;
    message: Message;
    connection: Map<WebSocket, string>;
    logger: Logger;
    gameState: GameState;
};

export const addUserToRoom = ({
    ws,
    message,
    connection,
    logger,
    gameState,
}: AddUserToRoomProps): void => {
    try {
        const { indexRoom } = JSON.parse(message.data) as UserToRoom;

        const idPlayer = connection.get(ws);
        if (!idPlayer) {
            logger.warn('Игрок не найден при попытке добавить в комнату.');
            return;
        }

        const room = gameState.rooms.get(indexRoom);
        if (!room) {
            logger.warn(`Комната с ID: ${indexRoom} не найдена.`);
            return;
        }

        if (room.players.some((player) => player.id === idPlayer)) {
            logger.warn(`Игрок с ID: ${idPlayer} уже находится в комнате с ID: ${indexRoom}.`);
            return;
        }

        const player = gameState.players.get(idPlayer);
        if (player) {
            room.players.push(player);
            logger.info(`Игрок с ID: ${idPlayer} добавлен в комнату с ID: ${indexRoom}.`);
            sendUpdateRoom({ logger, connection, gameState });
            createGame({ room, idPlayer, connection, logger });
        }
    } catch (e) {
        if (e instanceof Error) logger.error(e.message);
    }
};
