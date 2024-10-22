import { WebSocket, WebSocketServer } from 'ws';
import http from 'node:http';

import { Logger } from './common/logger';

export class BattleShipServer {
    private readonly socket: WebSocketServer;
    private readonly server: http.Server;
    private readonly port: number;
    private readonly connections: Set<WebSocket> = new Set();
    private readonly logger = new Logger(BattleShipServer.name);

    constructor() {
        this.port = parseInt(process.env.PORT || '3000');
        this.server = http.createServer(this.createHttpServer.bind(this));
        this.serverRun();
        this.socket = new WebSocketServer({ server: this.server });
        this.onConnection();
    }

    private createHttpServer(_: http.IncomingMessage, res: http.ServerResponse): void {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'connection chat server' }));
    }

    private serverRun(): void {
        this.server.listen(this.port, () =>
            this.logger.info('server running on port ' + this.port)
        );
    }

    private onConnection(): void {
        this.socket.on('connection', (connection, _) => {
            this.connections.add(connection);
            this.logger.info(`New connection. Total connections: ${this.connections.size}`);

            connection.on('message', (message: string) =>
                this.broadcastMessage(connection, message)
            );
            connection.on('close', () => {
                this.connections.delete(connection);
                this.logger.info(`Connection closed. Total connections: ${this.connections.size}`);
            });
            connection.on('error', (error: Error) => {
                this.logger.error(`Connection error: ${error.message}`);
                this.connections.delete(connection);
            });
        });
    }

    private broadcastMessage(sender: WebSocket, message: string): void {
        for (const client of this.connections) {
            if (client.readyState === WebSocket.OPEN && client !== sender) {
                client.send(message, { binary: false }, (err) => {
                    if (err) {
                        this.logger.error(`Failed to send message: ${err.message}`);
                    }
                });
            }
        }
    }
}

new BattleShipServer();
