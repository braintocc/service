import { describe, it, expect, mock } from "bun:test";
import request from 'supertest';
import express from 'express';
import { auth } from './';

const execMock = mock()
const findOneMock = mock()
findOneMock.mockReturnValue({
    exec: execMock
})

mock.module("../../../models/user", () => (
    {
        User: {
            findOne: findOneMock
        },
    })
)

const app = express();
app.use(express.json());
app.use('/', auth);

const mockUser = {
    destinations: {},
    save: mock(),
};

describe('Instagram Auth endpoint', () => {
    it('should return redirect to the origin url', async () => {
        execMock.mockReturnValue(mockUser);
        const response = await request(app)
            .post('/callback')
            .send({
                origin: 'http://localhost:3000',
                email: 'test@example.com',
                username: 'testuser',
                password: 'testpass'
            });
        expect(mockUser.destinations).toEqual({
            "testuser": {
                name: "testuser",
                username: "testuser",
                password: "testpass",
                integrations: ["social"],
                site: "instagram"
            }
        });
        expect(mockUser.save).toHaveBeenCalled();
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('http://localhost:3000');
    });
});