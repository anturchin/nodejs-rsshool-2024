import WebSocket, { WebSocketServer } from 'ws';

import { GameState, Message, Player, Room } from './common/interfaces';
import { Logger } from './common/logger';

export class BattleShipGameServer {
    private readonly wss: WebSocketServer;
    private readonly gameState: GameState;
    private readonly logger: Logger;

    constructor(port: number, logger: Logger) {
        this.wss = new WebSocketServer({ port });
        this.gameState = {
            players: new Map<string, Player>(),
            rooms: new Map<string, Room>(),
            winnerTable: [],
        };
        this.logger = logger;
        this.connect(port);
    }

    private connect(port: number): void {
        this.wss.on('connection', (ws: WebSocket) => this.onConnection(ws));
        this.logger.info(`WebSocket сервер запущен на порту ${port}`);
    }

    private onConnection(ws: WebSocket): void {
        ws.on('message', (message) => {
            const parsedMessage: Message = JSON.parse(message.toString());
            this.handleRequest(ws, parsedMessage);
        });

        ws.on('close', () => {
            this.logger.info('Соединение закрыто');
        });
    }

    private handleRequest(ws: WebSocket, parsedMessage: Message): void {}
}
