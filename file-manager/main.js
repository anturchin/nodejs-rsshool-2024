import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';

import { logger } from './utils/logger.js';
import { messages } from './constants/index.js';
import { closeSession, getCurrentlyPath, getUsername } from './utils/helpers.js';
import { parseInput } from './utils/inputParser.js';
import { cd, up } from './commands/navigation.js';

const rl = createInterface({
    input: stdin,
    output: stdout,
});

logger.logInfo(messages.welcome(getUsername()));
logger.logSuccess(messages.currently(getCurrentlyPath()));

rl.on('line', async (line) => {
    const { command, args } = parseInput(line);

    try {
        switch (command) {
            case 'up': {
                up();
                break;
            }
            case 'cd': {
                cd(args[0]);
                break;
            }
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
