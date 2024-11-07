import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

import { logger } from '../utils/logger.js';
import { messages } from '../constants/index.js';
import { exists } from '../utils/helpers.js';

export const compressFile = async (filePath, destination) => {
    const fileExists = await exists(filePath);
    if (!fileExists) throw new Error();

    try {
        const input = createReadStream(filePath);
        const output = createWriteStream(destination);
        const brotliCompress = createBrotliCompress();

        await pipeline(input, brotliCompress, output);
        logger.logSuccess(messages.success());
    } catch {
        throw new Error();
    }
};

export const decompressFile = async (filePath, destination) => {
    const fileExists = await exists(filePath);
    if (!fileExists) throw new Error();

    try {
        const input = createReadStream(filePath);
        const output = createWriteStream(destination);
        const brotliDecompress = createBrotliDecompress();

        await pipeline(input, brotliDecompress, output);
        logger.logSuccess(messages.success());
    } catch {
        throw new Error();
    }
};
