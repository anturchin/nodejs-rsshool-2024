import { IncomingMessage, ServerResponse } from 'node:http';
import { errorMessage } from '../common/constants';
import {
    createUser,
    deleteUser,
    getUser,
    getUsers,
    updateUser,
} from '../controllers/user.controller';

export const userRouter = async (req: IncomingMessage, res: ServerResponse) => {
    const { method, url } = req;
    const userIdMatch = url?.match(/^\/api\/users\/([a-z0-9-]+)$/);

    if (url === '/api/users' && method === 'GET') {
        try {
            await getUsers(req, res);
        } catch {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: errorMessage.SERVER_ERROR }));
        }
    } else if (userIdMatch && method === 'GET') {
        const userId = userIdMatch[1];
        try {
            await getUser(req, res, userId);
        } catch {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: errorMessage.SERVER_ERROR }));
        }
    } else if (url === '/api/users' && method === 'POST') {
        try {
            await createUser(req, res);
        } catch {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: errorMessage.SERVER_ERROR }));
        }
    } else if (userIdMatch && method === 'PUT') {
        const userId = userIdMatch[1];
        try {
            await updateUser(req, res, userId);
        } catch {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: errorMessage.SERVER_ERROR }));
        }
    } else if (userIdMatch && method === 'DELETE') {
        const userId = userIdMatch[1];
        try {
            await deleteUser(req, res, userId);
        } catch {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: errorMessage.SERVER_ERROR }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: errorMessage.ROUTE_NOT_FOUND }));
    }
};
