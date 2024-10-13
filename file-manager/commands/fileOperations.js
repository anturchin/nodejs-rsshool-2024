import { createReadStream } from 'node:fs';

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
