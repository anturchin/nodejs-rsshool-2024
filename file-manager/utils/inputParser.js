export const parseInput = (input) => {
    const [command, ...args] = input.trim().split(' ');
    return { command, args };
};
