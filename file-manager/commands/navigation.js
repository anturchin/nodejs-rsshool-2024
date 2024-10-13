import { cwd, chdir } from 'node:process';
import { dirname } from 'node:path';

export const up = () => {
    const currentDir = cwd();
    const parentDir = dirname(currentDir);

    if (parentDir !== currentDir) {
        chdir(parentDir);
    }
};
