import { readdir } from 'node:fs/promises';
import { cwd } from 'node:process';

import { logger } from '../utils/logger.js';

const compareFn = (a, b) => {
    if (a.Type === 'Directory' && b.Type === 'File') {
        return -1;
    } else if (a.Type === 'File' && b.Type === 'Directory') {
        return 1;
    }
    return 0;
};

export const ls = async () => {
    try {
        const files = await readdir(cwd(), { withFileTypes: true });

        const fileList = files.map((file) => {
            const fileType = file.isDirectory() ? 'Directory' : 'File';
            const fileName = file.name;

            return {
                Name: fileName,
                Type: fileType,
            };
        });

        const sortedList = [...fileList].sort(compareFn);

        logger.logTable(sortedList);
    } catch {
        throw new Error();
    }
};
