import { logErrors } from "./logErrors";
import { describe, it, expect, mock } from "bun:test";


const loggerMock = mock()

mock.module("../helpers/logger", () => (
    {
        default: {
            error: loggerMock
        },
    })
)

describe("logErrors", () => {
  it("should call the next function after logging the message", async () => {
    const err = new Error("Test error");
    const req: any = {};
    const res: any = {};
    const next: any = mock();

    await logErrors(err, req, res, next);

    expect(loggerMock).toHaveBeenCalledWith(err);
    expect(next).toHaveBeenCalledWith(err);
  });
});
