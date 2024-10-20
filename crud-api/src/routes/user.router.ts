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
        await getUsers(req, res);
    } else if (userIdMatch && method === 'GET') {
        const userId = userIdMatch[1];
        await getUser(req, res, userId);
    } else if (url === '/api/users' && method === 'POST') {
        await createUser(req, res);
    } else if (userIdMatch && method === 'PUT') {
        const userId = userIdMatch[1];
        await updateUser(req, res, userId);
    } else if (userIdMatch && method === 'DELETE') {
        const userId = userIdMatch[1];
        await deleteUser(req, res, userId);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: errorMessage.ROUTE_NOT_FOUND }));
    }
};
