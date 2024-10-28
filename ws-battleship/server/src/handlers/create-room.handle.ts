import { v4 as uuidv4 } from 'uuid';

import { GameState, Player, Room } from '../common/interfaces';
import { Logger } from '../common/logger';

type CreateRoomProps = {
    playerId: string;
    gameState: GameState;
    logger: Logger;
};

export const createRoot = ({ gameState, playerId, logger }: CreateRoomProps): void => {
    const newRoom: Room = {
        id: uuidv4(),
        players: [gameState.players.get(playerId) as Player],
        currentPlayerId: playerId,
    };

    gameState.rooms.set(newRoom.id, newRoom);
    logger.info(`Комната создана с ID: ${newRoom.id} игроком c ID: ${playerId}`);
};
