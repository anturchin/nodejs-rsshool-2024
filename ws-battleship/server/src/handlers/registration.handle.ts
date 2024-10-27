import WebSocket from 'ws';

import { GameState, Message, PlayerReqResponse, PlayerResResponse } from '../common/interfaces';
import { Logger } from '../common/logger';
import { createPlayer } from './create-player.handle';
import { sendUpdateRoom } from './send-update-room.handle';
import { sendUpdateWinners } from './send-update-winners.handle';

type RegistrationProp = {
    ws: WebSocket;
    connection: Map<WebSocket, string>;
    message: Message;
    gameState: GameState;
    logger: Logger;
};

export const registrationHandle = ({
    ws,
    message,
    gameState,
    logger,
    connection,
}: RegistrationProp): void => {
    try {
        const parsedMessage: PlayerReqResponse = JSON.parse(message.data);
        const { password, name } = parsedMessage;

        for (const player of gameState.players.values()) {
            if (player.name === name) {
                const res: PlayerResResponse = {
                    type: 'reg',
                    data: JSON.stringify({
                        name,
                        index: player.id,
                        error: true,
                        errorText: `Игрок с именем "${name}" уже зарегистрирован.`,
                    }),
                    id: 0,
                };
                logger.warn(`Игрок с именем "${name}" уже зарегистрирован.`);
                ws.send(JSON.stringify(res));
                return;
            }
        }

        createPlayer({ name, password, gameState, ws, logger, connection });
        sendUpdateRoom({ logger, connection, gameState });
        sendUpdateWinners({ logger, connection, gameState });
    } catch (e) {
        if (e instanceof Error) logger.error(e.message);
    }
};
