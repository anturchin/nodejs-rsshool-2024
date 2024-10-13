import { access, constants } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

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

const toBool = [() => true, () => false];

export const exists = (path) => {
    return access(path, constants.R_OK | constants.W_OK).then(...toBool);
};

export const getFilename = (url) => {
    return fileURLToPath(url);
};

export const getDirname = (url) => {
    return dirname(fileURLToPath(url));
};
