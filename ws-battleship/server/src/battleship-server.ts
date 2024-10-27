import WebSocket, { WebSocketServer } from 'ws';

import { GameState, Message, Player, Room } from './common/interfaces';
import { Logger } from './common/logger';
import { registrationHandle } from './handlers/registration.handle';
import { createRoot } from './handlers/create-room.handle';
import { addUserToRoom } from './handlers/add-user-to-room.handle';

export class BattleShipGameServer {
    private readonly wss: WebSocketServer;
    private readonly gameState: GameState;
    private readonly logger: Logger;
    private readonly connectedClients: Map<WebSocket, string>;

    constructor(port: number, logger: Logger) {
        this.wss = new WebSocketServer({ port });
        this.gameState = {
            players: new Map<string, Player>(),
            rooms: new Map<string, Room>(),
            winnerTable: [],
        };
        this.logger = logger;
        this.connectedClients = new Map();
        this.connect(port);
    }

    private connect(port: number): void {
        this.wss.on('connection', (ws: WebSocket) => this.onConnection(ws));
        this.logger.info(`WebSocket сервер запущен на порту ${port}`);
    }

    private onConnection(ws: WebSocket): void {
        this.logger.info(`Новый клиент подключен`);

        ws.on('message', (message) => {
            const parsedMessage: Message = JSON.parse(message.toString());
            this.handleRequest(ws, parsedMessage);
        });

        ws.on('close', () => {
            this.logger.info('Соединение закрыто');
            this.connectedClients.delete(ws);
        });
    }

    private handleRequest(ws: WebSocket, message: Message): void {
        switch (message.type) {
            case 'reg': {
                registrationHandle({
                    ws,
                    message,
                    logger: this.logger,
                    gameState: this.gameState,
                    connection: this.connectedClients,
                });
                break;
            }
            case 'create_room': {
                const playerId = this.connectedClients.get(ws);
                if (!playerId) {
                    this.logger.warn('Не удалось найти игрока для создания комнаты.');
                    return;
                }
                createRoot({
                    connection: this.connectedClients,
                    playerId,
                    logger: this.logger,
                    gameState: this.gameState,
                });
                break;
            }
            case 'add_user_to_room': {
                addUserToRoom({
                    ws,
                    logger: this.logger,
                    message,
                    connection: this.connectedClients,
                    gameState: this.gameState,
                });
                break;
            }
            case 'add_ships': {
                break;
            }
            case 'attack': {
                break;
            }
            case 'randomAttack': {
                break;
            }
            case 'single_play': {
                break;
            }
            default: {
                this.logger.warn(`Неизвестная команда: ${message.type}`);
                break;
            }
        }
    }
}
