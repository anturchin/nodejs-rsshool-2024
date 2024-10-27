import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';

import { GameState, Message, Player } from '../common/interfaces';
import { Logger } from '../common/logger';

type RegistrationProp = {
    ws: WebSocket;
    message: Message;
    gameState: GameState;
    logger: Logger;
};

type CreateUser = {
    name: string;
    password: string;
    gameState: GameState;
    ws: WebSocket;
    logger: Logger;
};

type ResResponse = {
    type: 'reg';
    data: string;
    id: number;
};

type ReqResponse = {
    name: string;
    password: string;
};

const createPlayer = ({ name, password, gameState, ws, logger }: CreateUser): void => {
    try {
        const newPlayer: Player = {
            id: uuidv4(),
            name: name,
            password: password,
            wins: 0,
        };

        gameState.players.set(newPlayer.id, newPlayer);

        const res: ResResponse = {
            type: 'reg',
            data: JSON.stringify({
                name,
                index: newPlayer.id,
                error: false,
                errorText: `Игрок зарегистрирован: ${newPlayer.name} с ID: ${newPlayer.id}`,
            }),
            id: 0,
        };
        logger.info(`Игрок зарегистрирован: ${newPlayer.name} с ID: ${newPlayer.id}`);
        ws.send(JSON.stringify(res));
    } catch (e) {
        if (e instanceof Error) logger.error(e.message);
    }
};

export const handleRegistration = ({ ws, message, gameState, logger }: RegistrationProp): void => {
    try {
        const parsedMessage: ReqResponse = JSON.parse(message.data);
        const { password, name } = parsedMessage;

        for (const player of gameState.players.values()) {
            if (player.name === name) {
                const res: ResResponse = {
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

        createPlayer({ name, password, gameState, ws, logger });
    } catch (e) {
        if (e instanceof Error) logger.error(e.message);
    }
};
