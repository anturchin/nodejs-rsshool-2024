import WebSocket from 'ws';

import { GameState } from '../common/interfaces';
import { Logger } from '../common/logger';

type UpdateWinnersProps = {
    connections: Map<WebSocket, string>;
    gameState: GameState;
    logger: Logger;
};

export const sendUpdateWinners = ({ connections, logger, gameState }: UpdateWinnersProps): void => {
    const updateWinnersData = {
        type: 'update_winners',
        data: JSON.stringify(gameState.winnerTable),
        id: 0,
    };

    logger.info('Отправка обновленного списка победителей.');

    for (const client of connections.keys()) {
        client.send(JSON.stringify(updateWinnersData));
    }
};
