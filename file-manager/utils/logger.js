const colors = {
    reset: '\x1b[0m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
    info: '\x1b[34m',
};

export const logger = {
    logSuccess: (msg) => console.log(`${colors.success} [ SUCCESS ]: ${msg} ${colors.success}`),
    logError: (msg) => console.log(`${colors.error} [ ERROR ]: ${msg} ${colors.reset}`),
    logWarn: (msg) => console.log(`${colors.warning} [ WARN ]: ${msg} ${colors.reset}`),
    logInfo: (msg) => console.log(`${colors.info} [ INFO ]: ${msg}${colors.reset}`),
};
