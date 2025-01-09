import { describe, it, expect, jest, mock } from "bun:test";
import request from 'supertest';
import express from 'express';
import { auth } from './';

const execMock = mock()
const findOneMock = mock()
const verifyCredentialsMock = mock()
const createRestAPIClientMock = mock()
findOneMock.mockReturnValue({
    exec: execMock
})
createRestAPIClientMock.mockReturnValue({
    v1: {
        accounts: {
            verifyCredentials: verifyCredentialsMock
        }
    }
})
verifyCredentialsMock.mockReturnValue({
    acct: "some-acct"
})

mock.module("../../../models/user", () => (
    {
        User: {
            findOne: findOneMock
        },
    })
)

mock.module("masto", () => (
    {
        createRestAPIClient: createRestAPIClientMock,
    })
)

const app = express();
app.use((req, res, next) =>{
    req.session={
        grant: {
            dynamic: {
                origin: 'http://localhost:3000'
            }
        }
    } as any
    res.locals={
        grant: {
            response: {
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

describe('Mastodon Auth endpoint', () => {
    it('should return redirect to the origin url', async () => {
        execMock.mockReturnValue(mockUser);
        const response = await request(app)
            .get('/callback')
            .send();
        expect(mockUser.destinations).toEqual({
            "some-acct": {
              name: "some-acct",
              accessToken: "abc",
              integrations: [ "social" ],
              site: "mastodon",
            },
          })
        expect(mockUser.save).toHaveBeenCalled()
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('http://localhost:3000');
    });
});
