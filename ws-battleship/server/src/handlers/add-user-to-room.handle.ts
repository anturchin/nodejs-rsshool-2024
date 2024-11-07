import WebSocket from 'ws';

import { GameState, Message, Room } from '../common/interfaces';
import { Logger } from '../common/logger';

type AddUserToRoomProps = {
    room: Room;
    idPlayer: string;
    indexRoom: string;
    gameState: GameState;
    logger: Logger;
};

export const addUserToRoom = ({
    room,
    idPlayer,
    indexRoom,
    logger,
    gameState,
}: AddUserToRoomProps): void => {
    const player = gameState.players.get(idPlayer);
    if (player) {
        room.players.push(player);
        logger.info(`Игрок с ID: ${idPlayer} добавлен в комнату с ID: ${indexRoom}.`);
    }
};
