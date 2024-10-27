import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';

import { GameState, Player, Room } from '../common/interfaces';
import { Logger } from '../common/logger';
import { sendUpdateRoom } from './send-update-room.handle';

type CreateRoomProps = {
    playerId: string;
    gameState: GameState;
    logger: Logger;
    connection: Map<WebSocket, string>;
};

export const createRoot = ({ connection, gameState, playerId, logger }: CreateRoomProps): void => {
    try {
        const newRoom: Room = {
            id: uuidv4(),
            players: [gameState.players.get(playerId) as Player],
            gameBoard: [],
            ships: [],
            turnIndex: 0,
        };

        gameState.rooms.set(newRoom.id, newRoom);
        logger.info(`Комната создана с ID: ${newRoom.id} игроком c ID: ${playerId}`);

        sendUpdateRoom({ logger, gameState, connection });
    } catch (e) {
        if (e instanceof Error) logger.error(e.message);
    }
};
