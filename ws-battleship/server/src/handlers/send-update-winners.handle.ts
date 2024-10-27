import WebSocket from 'ws';

import { GameState } from '../common/interfaces';
import { Logger } from '../common/logger';

type UpdateWinnersProps = {
    connection: Map<WebSocket, string>;
    gameState: GameState;
    logger: Logger;
};

export const sendUpdateWinners = ({ connection, logger, gameState }: UpdateWinnersProps): void => {
    const updateWinnersData = {
        type: 'update_winners',
        data: JSON.stringify(gameState.winnerTable),
        id: 0,
    };

    logger.info('Отправка обновленного списка победителей.');

    for (const client of connection.keys()) {
        client.send(JSON.stringify(updateWinnersData));
    }
};
