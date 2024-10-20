import { IncomingMessage, ServerResponse } from 'node:http';
import { v4 as uuidv4 } from 'uuid';

import { errorMessage } from '../common/constants';
import { User } from '../models/user.model';
import {
    createUserService,
    deleteUserService,
    getAllUsersService,
    getUserByIdService,
    updateUserService,
} from '../services/user.service';
import { validateUUID } from '../common/helpers';

export const getUsers = async (req: IncomingMessage, res: ServerResponse) => {
    const users = await getAllUsersService();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
};

export const getUser = async (req: IncomingMessage, res: ServerResponse, userId: string) => {
    if (!validateUUID(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: errorMessage.INVALID_UUID }));
    }

    const user = await getUserByIdService(userId);
    if (user) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: errorMessage.USER_NOT_FOUND }));
    }
};

export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const { username, age, hobbies } = JSON.parse(body) as User;
            if (!username || !age || !hobbies.length) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: errorMessage.REQUIRED_FIELDS }));
            }

            const user = await createUserService({ id: uuidv4(), username, age, hobbies });
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
        } catch {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: errorMessage.REQUIRED_FIELDS }));
        }
    });
};

export const updateUser = async (req: IncomingMessage, res: ServerResponse, userId: string) => {
    if (!validateUUID(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: errorMessage.INVALID_UUID }));
    }

    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const user = await updateUserService(userId, JSON.parse(body));
            if (user) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(user));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: errorMessage.USER_NOT_FOUND }));
            }
        } catch {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: errorMessage.BAD_REQUEST }));
        }
    });
};

export const deleteUser = async (req: IncomingMessage, res: ServerResponse, userId: string) => {
    if (!validateUUID(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: errorMessage.INVALID_UUID }));
    }

    const userExists = await deleteUserService(userId);
    if (userExists) {
        res.writeHead(204);
        res.end();
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: errorMessage.USER_NOT_FOUND }));
    }
};
