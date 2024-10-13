import { logger } from './logger.js';
import { messages } from '../constants/index.js';

export const getUsername = () => {
    const args = process.argv.slice(2);
    const usernameArgv = args.find((arg) => arg.startsWith('--username'));
    return usernameArgv ? usernameArgv.split('=')[1] : 'Anonymous';
};

export const getCurrentlyPath = () => process.cwd();

export const closeSession = (readline) => {
    logger.logInfo(messages.goodbye(getUsername()));
    readline.close();
    process.exit(0);
};
