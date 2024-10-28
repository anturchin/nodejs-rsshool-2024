import WebSocket, { WebSocketServer } from 'ws';

import { AddShip, Attack, GameState, Message, Player, Room, UserToRoom } from './common/interfaces';
import { Logger } from './common/logger';
import { registrationHandle } from './handlers/registration.handle';
import { createRoot } from './handlers/create-room.handle';
import { addUserToRoom } from './handlers/add-user-to-room.handle';
import { addShip } from './handlers/add_ship.handle';
import { sendUpdateRoom } from './handlers/send-update-room.handle';
import { sendUpdateWinners } from './handlers/send-update-winners.handle';
import { createGame } from './handlers/create-game.handle';
import { getIdPlayerAndRoom } from './helpers';
import { startGame } from './handlers/start-game.handle';
import { sendTurnUpdate } from './handlers/send-turn-update.handle';
import { attack } from './handlers/attack.handle';

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

    private reg(ws: WebSocket, message: Message): void {
        registrationHandle({
            ws,
            message,
            logger: this.logger,
            gameState: this.gameState,
            connection: this.connectedClients,
        });
        sendUpdateRoom({
            logger: this.logger,
            gameState: this.gameState,
            connections: this.connectedClients,
        });
        sendUpdateWinners({
            logger: this.logger,
            gameState: this.gameState,
            connections: this.connectedClients,
        });
    }

    private createRoom(ws: WebSocket): void {
        const playerId = this.connectedClients.get(ws);
        if (!playerId) {
            this.logger.warn('Не удалось найти игрока для создания комнаты.');
            return;
        }
        createRoot({
            playerId,
            logger: this.logger,
            gameState: this.gameState,
        });
        sendUpdateRoom({
            logger: this.logger,
            gameState: this.gameState,
            connections: this.connectedClients,
        });
    }

    private addUserToRoom(ws: WebSocket, message: Message): void {
        const { indexRoom } = JSON.parse(message.data) as UserToRoom;
        const playerAndRoom = getIdPlayerAndRoom({
            logger: this.logger,
            gameState: this.gameState,
            ws,
            indexRoom,
            connectedClients: this.connectedClients,
        });
        if (!playerAndRoom) {
            return;
        }
        const { room, idPlayer } = playerAndRoom;
        addUserToRoom({
            room,
            idPlayer,
            logger: this.logger,
            gameState: this.gameState,
            indexRoom,
        });
        sendUpdateRoom({
            logger: this.logger,
            gameState: this.gameState,
            connections: this.connectedClients,
        });

        if (room.players.length === 2) {
            createGame({
                room,
                idPlayer,
                logger: this.logger,
                connections: this.connectedClients,
            });
        }
    }

    private addShips(ws: WebSocket, message: Message): void {
        const { ships, gameId, indexPlayer } = JSON.parse(message.data) as AddShip;

        addShip({
            logger: this.logger,
            message: { ships, gameId, indexPlayer },
            ws,
            gameState: this.gameState,
            connections: this.connectedClients,
        });

        const room = this.gameState.rooms.get(gameId);
        if (!room) {
            this.logger.warn(`Комната с ID: ${gameId} не найдена.`);
            return;
        }

        const playersWithShips = room.players.filter((player) => player.ships.length > 0);

        if (playersWithShips.length < 2) {
            this.logger.warn(
                `Недостаточно игроков с добавленными кораблями в комнате с ID: ${room.id}.`
            );
            return;
        }

        startGame({
            indexPlayer,
            room,
            logger: this.logger,
            connections: this.connectedClients,
        });

        sendTurnUpdate({
            currentPlayer: indexPlayer,
            room,
            logger: this.logger,
            connections: this.connectedClients,
        });
    }

    private attack(ws: WebSocket, message: Message): void {
        const { gameId, y, x, currentPlayer } = JSON.parse(message.data) as Attack;

        const room = this.gameState.rooms.get(gameId);
        if (!room) {
            this.logger.warn(`Комната с ID: ${gameId} не найдена.`);
            return;
        }

        if (room.currentPlayerId !== currentPlayer) {
            this.logger.warn(`Неправильный игрок делает ход в комнате с ID: ${gameId}.`);
            return;
        }

        const player = room.players.find((p) => p.id === currentPlayer);
        if (!player) {
            this.logger.warn(`Игрок с ID: ${currentPlayer} не найден в комнате с ID: ${gameId}.`);
            return;
        }

        attack({
            y,
            x,
            currentPlayer,
            room,
            connections: this.connectedClients,
            logger: this.logger,
            player,
        });

        sendTurnUpdate({
            currentPlayer,
            room,
            logger: this.logger,
            connections: this.connectedClients,
        });
    }

    private handleRequest(ws: WebSocket, message: Message): void {
        switch (message.type) {
            case 'reg': {
                this.reg(ws, message);
                break;
            }
            case 'create_room': {
                this.createRoom(ws);
                break;
            }
            case 'add_user_to_room': {
                this.addUserToRoom(ws, message);
                break;
            }
            case 'add_ships': {
                this.addShips(ws, message);
                break;
            }
            case 'attack': {
                this.attack(ws, message);
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
