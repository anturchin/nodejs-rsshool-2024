import os from 'node:os';
import { logger } from '../utils/logger.js';

export const getOSInfo = (command) => {
    switch (command) {
        case '--EOL':
            logger.logInfo(`EOL: ${JSON.stringify(os.EOL)}`);
            break;
        case '--cpus':
            logger.logInfo(`CPUs: ${os.cpus().length}`);
            break;
        case '--homedir':
            logger.logInfo(`Home Directory: ${os.homedir()}`);
            break;
        case '--username':
            logger.logInfo(`Username: ${os.userInfo().username}`);
            break;
        case '--architecture':
            logger.logInfo(`Architecture: ${os.arch()}`);
            break;
        default:
            logger.logError('Invalid input');
    }
};
