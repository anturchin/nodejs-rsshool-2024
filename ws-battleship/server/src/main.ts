import 'dotenv/config';

import { BattleShipGameServer } from './battleship-server';
import { Logger } from './common/logger';

const startGame = (port: number): void => {
    const loggerName = BattleShipGameServer.name;
    new BattleShipGameServer(port, new Logger(loggerName));
};

startGame(Number(process.env.PORT || '3000'));
