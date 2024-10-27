import WebSocket from 'ws';

import { GameState, Room } from '../common/interfaces';
import { Logger } from '../common/logger';

type UpdateRoomProps = {
    connection: Map<WebSocket, string>;
    gameState: GameState;
    logger: Logger;
};

export const sendUpdateRoom = ({ connection, gameState, logger }: UpdateRoomProps): void => {
    const roomsWithSinglePlayer = [...gameState.rooms.values()].filter(
        (room) => room.players.length === 1
    );

    const updateRoomData = {
        type: 'update_room',
        data: JSON.stringify(
            roomsWithSinglePlayer.map((room: Room) => ({
                roomId: room.id,
                roomUsers: room.players.map((player) => ({
                    name: player.name,
                    index: player.id,
                })),
            }))
        ),
        id: 0,
    };

    if (roomsWithSinglePlayer.length === 0) {
        logger.info('Нет комнат с одним игроком для отправки.');
        return;
    }

    logger.info(
        `Отправка обновленного списка комнат с одним игроком, количество: ${roomsWithSinglePlayer.length}`
    );

    for (const client of connection.keys()) {
        client.send(JSON.stringify(updateRoomData));
    }
};
