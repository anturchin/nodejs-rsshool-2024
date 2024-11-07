import 'dotenv/config';
import http from 'node:http';
import cluster from 'node:cluster';
import os from 'node:os';

import { logger } from './common/logger';
import { userRouter } from './routes/user.router';
import { User } from './models/user.model';
import { UpdateUsersMessage } from './common/interfaces';

export const usersInMemoryDb: User[] = [];

const multi = () => {
    const BALANCER_PORT = parseInt(process.env.BALANCER_PORT as string, 10) || 3000;
    const WORKER_PORT = parseInt(process.env.WORKER_PORT as string, 10) || 4000;
    const cpus = os.cpus().length;
    let currentWorker = 0;

    if (cluster.isPrimary) {
        logger.info(`[Primary] Primary process is starting ${cpus - 1} workers...`);
        for (let i = 0; i < cpus - 1; i++) cluster.fork();

        const loadBalancer = http.createServer((req, res) => {
            const workerPort = WORKER_PORT + (currentWorker % (cpus - 1));
            currentWorker++;

            const proxy = http.request(
                {
                    hostname: 'localhost',
                    port: workerPort,
                    path: req.url,
                    method: req.method,
                    headers: req.headers,
                },
                (proxyRes) => {
                    res.writeHead(proxyRes.statusCode!, proxyRes.headers);
                    proxyRes.pipe(res, { end: true });
                }
            );

            proxy.on('error', (err) => {
                logger.error(`Error with proxying request to worker: ${err.message}`);
                res.writeHead(502);
                res.end('Bad Gateway');
            });

            req.pipe(proxy, { end: true });
            logger.info(`Request redirected to worker on port ${workerPort}`);
        });

        loadBalancer.listen(BALANCER_PORT, () => {
            logger.info(`[Primary] Load balancer is running on http://localhost:${BALANCER_PORT}`);
        });

        cluster.on('exit', (worker, code, signal) => {
            logger.warn(
                `[Primary] Worker [PID: ${worker.process.pid}] exited with code ${code}, signal ${signal}`
            );
            const newWorker = cluster.fork();
            logger.info(`[Primary] New worker [PID: ${newWorker.process.pid}] started`);
        });

        cluster.on('message', (worker, message) => {
            if (message.type === 'updateUsers') {
                usersInMemoryDb.splice(0, usersInMemoryDb.length, ...message.users);
                logger.info(
                    `[Primary] Users updated in memory: ${JSON.stringify(usersInMemoryDb)}`
                );
                for (const id in cluster.workers) {
                    cluster.workers[id]?.send(message);
                }
            }
        });
    } else {
        const workerPort = WORKER_PORT + cluster.worker!.id;
        http.createServer(userRouter).listen(workerPort, () =>
            logger.info(
                `[Worker] Worker ${cluster.worker!.id} is running on http://localhost:${workerPort}`
            )
        );

        process.on('message', (message: UpdateUsersMessage) => {
            if (message.type === 'updateUsers') {
                usersInMemoryDb.splice(0, usersInMemoryDb.length, ...message.users);
                logger.info(
                    `[Worker ${cluster.worker!.id}] Users updated: ${JSON.stringify(usersInMemoryDb)}`
                );
            }
        });
    }
};

multi();
