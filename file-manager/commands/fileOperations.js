import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { writeFile, unlink, rename } from 'node:fs/promises';
import { join } from 'path';

import { logger } from '../utils/logger.js';
import { exists } from '../utils/helpers.js';
import { messages } from '../constants/index.js';

export const cat = async (filePath) => {
    if (await exists(filePath)) {
        const stream = createReadStream(filePath, { encoding: 'utf8' });
        stream.on('data', (chunk) => logger.logInfo(chunk));
        stream.on('error', () => logger.logError(messages.failed()));
    } else {
        throw new Error();
    }
};

export const add = async (fileName) => {
    try {
        await writeFile(fileName, '', { encoding: 'utf8' });
    } catch {
        throw new Error();
    }
};

export const rm = async (filePath) => {
    try {
        if (await exists(filePath)) {
            await unlink(filePath);
        } else {
            throw new Error();
        }
    } catch {
        throw new Error();
    }
};

export const rn = async (filePath, newFileName) => {
    try {
        if (await exists(filePath)) {
            const fileDir = filePath.split('/').slice(0, -1).join('/');
            const newFilePath = join(fileDir, newFileName);

            await rename(filePath, newFilePath);
        } else {
            throw new Error();
        }
    } catch {
        throw new Error();
    }
};

export const cp = async (filePath, newDirPath) => {
    const fileExists = await exists(filePath);
    const dirExists = await exists(newDirPath);
    if (!fileExists) {
        throw new Error();
    }
    if (!dirExists) {
        throw new Error();
    }

    const fileName = filePath.split('/').pop();
    const newFilePath = join(newDirPath, fileName);

    const readStream = createReadStream(fileName);
    const writeStream = createWriteStream(newFilePath);
    try {
        await pipeline(readStream, writeStream);
    } catch {
        throw new Error();
    }
};
