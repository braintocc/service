// Import necessary dependencies at the top of your file
import { describe, it, expect, jest, mock } from "bun:test";
import request from 'supertest';
import express from 'express';
import { auth } from './';


const execMock = jest.fn()
const findOneMock = jest.fn()
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

describe('Auth endpoint', () => {
    it('should return redirect to the origin url', async () => {
        execMock.mockReturnValue(mockUser);
        const response = await request(app)
            .post('/callback')
            .send({
                origin: 'http://localhost:3000',
                identifier: 'some-identifier',
                password: 'some-password',
            });
        expect(mockUser.destinations).toEqual({
            mybluesky: {
              name: "mybluesky",
              integrations: [ "social" ],
              site: "bluesky",
              identifier: "some-identifier",
              password: "some-password",
            },
          })
        expect(mockUser.save).toHaveBeenCalled()
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('http://localhost:3000');
    });
});
