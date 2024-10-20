const colors = {
    reset: '\x1b[0m',
    error: '\x1b[31m',
    warn: '\x1b[33m',
    info: '\x1b[34m',
};

export const logger = {
    warn: (msg: string) => console.log(`${colors.warn} [ WARN ]: ${msg} ${colors.reset}`),
    error: (msg: string) => console.log(`${colors.error} [ ERROR ]: ${msg} ${colors.reset}`),
    info: (msg: string) => console.log(`${colors.info} [ INFO ]: ${msg}${colors.reset}`),
};
