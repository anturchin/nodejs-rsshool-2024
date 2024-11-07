import { v4 as uuidv4 } from 'uuid';
import WebSocket from 'ws';

import { CellState, GameBoard, GameState, Player, PlayerResResponse } from '../common/interfaces';
import { Logger } from '../common/logger';

type CreateUser = {
    name: string;
    password: string;
    gameState: GameState;
    ws: WebSocket;
    connection: Map<WebSocket, string>;
    logger: Logger;
};

export const createPlayer = ({
    name,
    password,
    gameState,
    ws,
    logger,
    connection,
}: CreateUser): void => {

    const newPlayer: Player = {
        id: uuidv4(),
        name: name,
        password: password,
        ships: [],
        wins: 0,
        gameBoard: Array.from({ length: 10 }, () => Array(10).fill(CellState.Empty)) as GameBoard,
        ready: false,
    };

    gameState.players.set(newPlayer.id, newPlayer);
    connection.set(ws, newPlayer.id);

    const res: PlayerResResponse = {
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
};
