import morgan from "morgan";
import Logger from "../helpers/logger";
import { Response } from "express";

export const requestLogger = morgan(
    function (tokens: any , req: any, res: Response) {
      return JSON.stringify({
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: res.statusCode,
        response_time: Number.parseFloat(tokens['response-time'](req, res)),
      });
    },
    {
      stream: {
        write: (message) => {
            const data = JSON.parse(message);
            if(data.status <400) Logger.info(data)
            else if(data.status < 500) Logger.warn(data)
            else Logger.error(data)
        },
      },
    }
  );
