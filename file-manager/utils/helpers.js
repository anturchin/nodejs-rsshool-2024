import { access, constants } from 'node:fs/promises';
import { exit, cwd, argv } from 'node:process';
import { createReadStream, createWriteStream } from 'node:fs';
import { join } from 'node:path';

import { logger } from './logger.js';
import { messages } from '../constants/index.js';

export const getUsername = () => {
    const args = argv.slice(2);
    const usernameArgv = args.find((arg) => arg.startsWith('--username'));
    return usernameArgv ? usernameArgv.split('=')[1] : 'Anonymous';
};

export const getCurrentlyPath = () => cwd();

export const closeSession = (readline) => {
    logger.logInfo(messages.goodbye(getUsername()));
    readline.close();
    exit(0);
};

const toBool = [() => true, () => false];

export const exists = (path) => {
    return access(path, constants.R_OK | constants.W_OK).then(...toBool);
};

export const fileOrDirExists = async (filePath, newDirPath) => {
    const fileExists = await exists(filePath);
    const dirExists = await exists(newDirPath);
    if (!fileExists) {
        throw new Error();
    }
    if (!dirExists) {
        throw new Error();
    }
};

export const createStream = (filePath, newDirPath) => {
    const fileName = filePath.split('/').pop();
    const newFilePath = join(newDirPath, fileName);

    const readStream = createReadStream(filePath);
    const writeStream = createWriteStream(newFilePath);
    return { readStream, writeStream };
};
