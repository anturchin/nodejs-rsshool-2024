import WebSocket, { WebSocketServer } from 'ws';

import { GameState, Message, Player, Room } from './common/interfaces';
import { Logger } from './common/logger';
import { handleRegistration } from './handlers/handleRegistration';

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
        this.logger.info('Новый клиент подключен');

        ws.on('message', (message) => {
            const parsedMessage: Message = JSON.parse(message.toString());
            this.handleRequest(ws, parsedMessage);
        });

        ws.on('close', () => {
            this.logger.info('Соединение закрыто');
        });
    }

    private handleRequest(ws: WebSocket, message: Message): void {
        switch (message.type) {
            case 'reg': {
                handleRegistration({ ws, message, logger: this.logger, gameState: this.gameState });
                break;
            }
            case 'update_winners': {
                break;
            }
            case 'create_room': {
                break;
            }
            case 'add_user_to_room': {
                break;
            }
            case 'create_game': {
                break;
            }
            case 'update_room': {
                break;
            }
            case 'add_ships': {
                break;
            }
            case 'start_game': {
                break;
            }
            case 'attack': {
                break;
            }
            case 'randomAttack': {
                break;
            }
            case 'turn': {
                break;
            }
            case 'finish': {
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
