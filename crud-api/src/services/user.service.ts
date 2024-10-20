import { usersInMemoryDb } from '../db/in-memory.db';
import { User } from '../models/user.model';

const users: User[] = usersInMemoryDb;

export const getAllUsers = async (): Promise<User[]> => {
    return users;
};

export const getUserById = async (id: string): Promise<User | undefined> => {
    return users.find((user) => user.id === id);
};

export const createUser = async (data: User): Promise<User> => {
    const newUser: User = { ...data };
    users.push(newUser);
    return newUser;
};

export const deleteUser = async (id: string): Promise<boolean> => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        users.splice(index, 1);
        return true;
    }
    return false;
};

export const updateUser = async (id: string, data: User): Promise<User | null> => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        const updatedUser: User = { ...users[index], ...data };
        users[index] = updatedUser;
        return updatedUser;
    }
    return null;
};
