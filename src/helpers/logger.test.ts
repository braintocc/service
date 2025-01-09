import Logger from './logger';
import LokiTransport from "winston-loki";
import winston from 'winston'
import { describe, it, expect } from "bun:test";
import { env } from 'bun';

describe.skip('Logger', () => {
  it('should have the correct levels', () => {
    expect(Logger.levels).toEqual({
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      debug: 4,
    });
  });

  it('should have the correct transports', () => {
    const consoleTransport = new winston.transports.Console({
      format: Logger.format,
    });
    const lokiTransport = new LokiTransport({
      labels: { app: 'brainto-service' },
      host: env.GRAFANA_HOST!,
      json: true,
      basicAuth: env.GRAFANA_AUTH!,
    });

    expect(Logger.transports).toEqual([consoleTransport, lokiTransport]);
  });
});
