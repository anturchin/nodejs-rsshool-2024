import WebSocket from 'ws';

import { GameState, Player, Room } from '../common/interfaces';
import { Logger } from '../common/logger';

type IdPlayerAndRoom = {
    ws: WebSocket;
    connectedClients: Map<WebSocket, string>;
    logger: Logger;
    indexRoom: string;
    gameState: GameState;
};

type GetClientProps = {
    player: Player;
    connections: Map<WebSocket, string>;
};
export const getIdPlayerAndRoom = ({
    ws,
    connectedClients,
    logger,
    indexRoom,
    gameState,
}: IdPlayerAndRoom): { idPlayer: string; room: Room } | undefined => {
    const idPlayer = connectedClients.get(ws);
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

    return { idPlayer, room };
};

export const getClient = ({ player, connections }: GetClientProps) => {
    return [...connections.entries()].find(([ws, id]) => id === player.id)?.[0];
};
