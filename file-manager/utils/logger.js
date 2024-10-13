const colors = {
    reset: '\x1b[0m',
    info: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
}

export const logger = {
    logInfo: (msg) => console.log(`${colors.info} [ INFO ]: ${msg} ${colors.reset}`),
    logError: (msg) => console.log(`${colors.error} [ ERROR ]: ${msg} ${colors.reset}`),
    logWarn: (msg) => console.log(`${colors.warning} [ WARN ]: ${msg} ${colors.reset}`),
}
