import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { pipeline } from 'node:stream/promises';

import { exists } from '../utils/helpers.js';
import { logger } from '../utils/logger.js';

export const calculateHash = async (filePath) => {
    const fileExists = await exists(filePath);
    if (!fileExists) {
        throw new Error();
    }

    const hash = createHash('sha256');
    const readStream = createReadStream(filePath);

    try {
        await pipeline(readStream, hash);
        const hashValue = hash.digest('hex');
        logger.logInfo(hashValue);
    } catch {
        throw new Error();
    }
};
