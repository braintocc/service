import { describe, it, expect, jest, mock } from "bun:test";
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
                raw: {
                    workspace_id:"some-uuid",
                    workspace_name: "some-name"
                },
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

describe('Notion Auth endpoint', () => {
    it('should return redirect to the origin url', async () => {
        execMock.mockReturnValue(mockUser);
        const response = await request(app)
            .get('/callback')
            .send();
        expect(mockUser.sources).toEqual({
            "some-uuid": {
              name: "some-name",
              accessToken: "abc",
              integrations: [ "social" ],
              site: "notion",
            },
          })
        expect(mockUser.save).toHaveBeenCalled()
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('http://localhost:3000');
    });
});
