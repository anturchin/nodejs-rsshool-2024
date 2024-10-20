import { User } from '../models/user.model';
import { UpdateUsersMessage } from '../common/interfaces';

const users: User[] = [];

export const getAllUsersService = async (): Promise<User[]> => {
    return users;
};

export const getUserByIdService = async (id: string): Promise<User | undefined> => {
    return users.find((user) => user.id === id);
};

export const createUserService = async (user: User): Promise<User> => {
    const newUser: User = { ...user };
    users.push(newUser);
    notifyWorkers();
    return newUser;
};

export const deleteUserService = async (id: string): Promise<boolean> => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        users.splice(index, 1);
        notifyWorkers();
        return true;
    }
    return false;
};

export const updateUserService = async (id: string, data: User): Promise<User | null> => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        const updatedUser: User = { ...users[index], ...data };
        users[index] = updatedUser;
        notifyWorkers();
        return updatedUser;
    }
    return null;
};

const notifyWorkers = () => {
    if (process.send) {
        process.send({ type: 'updateUsers', users });
    }
};

process.on('message', (message: UpdateUsersMessage) => {
    if (message.type === 'updateUsers') {
        users.splice(0, users.length, ...message.users);
    }
});
