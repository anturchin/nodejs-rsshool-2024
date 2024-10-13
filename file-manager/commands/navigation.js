import { cwd, chdir } from 'node:process';
import { dirname } from 'node:path';
import { logger } from '../utils/logger.js';
import { messages } from '../constants/index.js';
import { getCurrentlyPath } from '../utils/helpers.js';

export const up = () => {
    const currentDir = cwd();
    const parentDir = dirname(currentDir);

    if (parentDir !== currentDir) {
        chdir(parentDir);
        logger.logInfo(messages.currently(getCurrentlyPath()));
    }
};

export const cd = (path) => {
    try {
        chdir(path);
        logger.logInfo(messages.currently(getCurrentlyPath()));
    } catch {
        throw new Error();
    }
};
