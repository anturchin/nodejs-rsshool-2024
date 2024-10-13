import readline from 'node:readline';

import { logger } from './utils/logger.js';
import { messages } from './constants/index.js';
import { closeSession, getCurrentlyPath, getUsername } from './utils/helpers.js';
import { parseInput } from './utils/inputParser.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

logger.logInfo(messages.welcome(getUsername()));
logger.logSuccess(messages.currently(getCurrentlyPath()));

rl.on('line', async (line) => {
    const { command } = parseInput(line);

    try {
        switch (command) {
            case '.exit': {
                closeSession(rl);
                break;
            }
            default: {
                logger.logError(messages.invalid());
                break;
            }
        }
    } catch {
        logger.logError(messages.failed());
    }
    logger.logInfo(messages.currently(getCurrentlyPath()));
});

rl.on('SIGINT', () => {
    closeSession(rl);
});
