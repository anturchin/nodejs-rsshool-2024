export const messages = {
    welcome: (username) => `Welcome to the File Manager, ${username}!`,
    goodbye: (username) => `Thank you for using File Manager, ${username}, goodbye!`,
    currently: (cwd) => `You are currently in ${cwd}`,
    failed: () => `Operation failed`,
    success: () => `Operation success`,
    invalid: () => `Invalid input`,
};
