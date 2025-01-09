
import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import { checkJwt } from "./auth";
import { env } from "bun";

const jwtVerifyMock = mock();
const createRemoteJWKSetMock = mock();

mock.module("jose", () => ({
        jwtVerify: jwtVerifyMock,
        createRemoteJWKSet: createRemoteJWKSetMock
    })
)

describe("checkJwt function", () => {
    beforeEach(() => {
        jwtVerifyMock.mockClear()
        createRemoteJWKSetMock.mockClear()
    })

    afterEach(() => {
        env.NODE_ENV = "test"
    })

  it("should call next() if JWT is valid", async () => {
    env.NODE_ENV = "fake"
    const req = { headers: { authorization: "Bearer token" } };
    const res = { status: mock(), send: mock() };
    const next = mock()
    createRemoteJWKSetMock.mockReturnValue("OK")
    await checkJwt(req, res, next);
    expect(jwtVerifyMock).toHaveBeenCalledWith("token", "OK")
    expect(next).toBeCalled()
    expect(res.status).not.toHaveBeenCalled();
  });
});
