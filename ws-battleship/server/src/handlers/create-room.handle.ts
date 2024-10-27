import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';

import { GameState, Player, Room } from '../common/interfaces';
import { Logger } from '../common/logger';

type CreateRoomProps = {
    playerId: string;
    gameState: GameState;
    ws: WebSocket;
    logger: Logger;
};

type ResResponse = {
    type: string;
    data: string;
    id: number;
};
export const createRoot = ({ ws, gameState, playerId, logger }: CreateRoomProps): void => {
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

        const updateData: ResResponse = {
            type: 'update_room',
            data: JSON.stringify([
                {
                    roomId: newRoom.id,
                    roomUsers: newRoom.players.map((player) => ({
                        name: player.name,
                        index: player.id,
                    })),
                },
            ]),
            id: 0,
        };

        ws.send(JSON.stringify(updateData));
    } catch (e) {
        if (e instanceof Error) logger.error(e.message);
    }
};
