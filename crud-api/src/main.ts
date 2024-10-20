import 'dotenv/config';
import http from 'node:http';
import cluster from 'node:cluster';
import os from 'node:os';

import { logger } from './common/logger';

const start = () => {
    const PORT = process.env.PORT || '3000';
    const pid = process.pid;
    const cpus = os.cpus().length;

    if (cluster.isPrimary) {
        logger.info(`[PID: ${pid}] Primary process is starting ${cpus} workers...`);
        for (let i = 0; i < cpus; i++) cluster.fork();

        cluster.on('exit', (worker, code, signal) => {
            logger.warn(
                `Worker [PID: ${worker.process.pid}] exited with code ${code}, signal ${signal}`
            );
            cluster.fork();
        });
    } else {
        http.createServer((_, res) => {
            res.end(`hello from nodejs!!!`);
        }).listen(PORT, () =>
            logger.info(`[PID: ${pid}] Worker is running on http://localhost:${PORT}`)
        );
    }
};

start();
