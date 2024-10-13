import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';

import { logger } from './utils/logger.js';
import { messages } from './constants/index.js';
import { closeSession, getCurrentlyPath, getUsername } from './utils/helpers.js';
import { parseInput } from './utils/inputParser.js';
import { cd, up } from './commands/navigation.js';
import { ls } from './commands/fileManager.js';
import { add, cat, cp, mv, rm, rn } from './commands/fileOperations.js';
import { getOSInfo } from './commands/systemInfo.js';
import { calculateHash } from './commands/hash.js';

const rl = createInterface({
    input: stdin,
    output: stdout,
});

logger.logInfo(messages.welcome(getUsername()));
logger.logSuccess(messages.currently(getCurrentlyPath()));

rl.on('line', async (line) => {
    const { command, args } = parseInput(line);

    try {
        switch (command) {
            case 'up': {
                up();
                break;
            }
            case 'cd': {
                cd(args[0]);
                break;
            }
            case 'ls': {
                await ls();
                break;
            }
            case 'cat': {
                await cat(args[0]);
                break;
            }
            case 'add': {
                await add(args[0]);
                break;
            }
            case 'rm': {
                await rm(args[0]);
                break;
            }
            case 'rn': {
                await rn(args[0], args[1]);
                break;
            }
            case 'cp': {
                await cp(args[0], args[1]);
                break;
            }
            case 'mv': {
                await mv(args[0], args[1]);
                break;
            }
            case 'os': {
                getOSInfo(args[0]);
                break;
            }
            case 'hash': {
                await calculateHash(args[0]);
                break;
            }
            case '.exit': {
                closeSession(rl);
                break;
            }
            default: {
                logger.logError(messages.invalid());
                break;
            }
        }
    } catch {
        logger.logError(messages.failed());
    }
});

rl.on('SIGINT', () => {
    closeSession(rl);
});
