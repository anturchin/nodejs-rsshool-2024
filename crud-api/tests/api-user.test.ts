import { createServer } from 'node:http';
import request from 'supertest';

import { userRouter } from '../src/routes/user.router';
import { User } from '../src/models/user.model';

const app = createServer(userRouter);

describe('User Api', () => {
    let createdUserId: string;

    it('GET /api/users - should return an empty array', async () => {
        const response = await request(app).get('/api/users');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('POST /api/users - should create a new user', async () => {
        const newUser: Omit<User, 'id'> = { username: 'lebowski', age: 33, hobbies: ['boxing'] };
        const response = await request(app).post('/api/users').send(newUser);

        const { id, ...user } = (await response.body) as User;
        createdUserId = id;

        expect(response.status).toBe(201);
        expect(user).toEqual(newUser);
    });

    it('GET /api/users/:id - should return the created user', async () => {
        const response = await request(app).get(`/api/users/${createdUserId}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({ id: createdUserId }));
    });

    it('PUT /api/users/:id - should update the user', async () => {
        const updatedUser: Partial<User> = { age: 36, username: 'big' };
        const response = await request(app).put(`/api/users/${createdUserId}`).send(updatedUser);

        const { id, ...user } = (await response.body) as User;

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({ id: createdUserId, ...updatedUser })
        );
    });
    it('DELETE /api/users/:id - should delete the user', async () => {
        const response = await request(app).delete(`/api/users/${createdUserId}`);

        expect(response.status).toBe(204);
    });
    it('GET /api/users/:id - should return 404 for deleted user', async () => {
        const response = await request(app).get(`/api/users/${createdUserId}`);

        expect(response.status).toBe(404);
    });
});
