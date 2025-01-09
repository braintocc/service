import { describe, it, expect, jest, mock } from "bun:test";
import request from 'supertest';
import express from 'express';
import { auth } from './';
import { origin } from "bun";

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
app.use((req, res, next) =>{
    req.session={
        grant: {
            dynamic: {
                user: "pepe",
                origin: 'http://localhost:3000'
            }
        }
    } as any
    res.locals={
        grant: {
            response: {
                id_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
                access_token: "abc"
            }
        }
    }
    next()
})
app.use(express.json());
app.use('/', auth);

const mockUser = {
    destinations: {},
    save: mock(),
};

describe('LinkedIn Auth endpoint', () => {
    it('should return redirect to the origin url', async () => {
        execMock.mockReturnValue(mockUser);
        const response = await request(app)
            .get('/callback')
            .send();
        expect(mockUser.destinations).toEqual({
            "John Doe": {
              name: "John Doe",
              accessToken: "abc",
              integrations: [ "social" ],
              site: "linkedin",
            },
          })
        expect(mockUser.save).toHaveBeenCalled()
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('http://localhost:3000');
    });
});
