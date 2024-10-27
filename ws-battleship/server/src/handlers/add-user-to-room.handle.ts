import WebSocket from 'ws';

import { GameState, Message, UserToRoom } from '../common/interfaces';
import { Logger } from '../common/logger';
import { sendUpdateRoom } from './send-update-room.handle';

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

        const playerId = connection.get(ws);
        if (!playerId) {
            logger.warn('Игрок не найден при попытке добавить в комнату.');
            return;
        }

        const room = gameState.rooms.get(indexRoom);
        if (!room) {
            logger.warn(`Комната с ID: ${indexRoom} не найдена.`);
            return;
        }

        if (room.players.some((player) => player.id === playerId)) {
            logger.warn(`Игрок с ID: ${playerId} уже находится в комнате с ID: ${indexRoom}.`);
            return;
        }

        const player = gameState.players.get(playerId);
        if (player) {
            room.players.push(player);
            logger.info(`Игрок с ID: ${playerId} добавлен в комнату с ID: ${indexRoom}.`);
            sendUpdateRoom({ logger, connection, gameState });
        }
    } catch (e) {
        if (e instanceof Error) logger.error(e.message);
    }
};
