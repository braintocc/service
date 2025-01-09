import { env } from 'bun';
import winston from 'winston'
import LokiTransport from "winston-loki";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
)

const transports = [
  new winston.transports.Console({
    format
  }),
  new LokiTransport({
    labels: {app: "brainto-service"},
    host: env.GRAFANA_HOST!,
    json: true,
    format: winston.format.json(),
    basicAuth: env.GRAFANA_AUTH!,
  })
]

const Logger = winston.createLogger({
  level: 'http',
  levels,
  transports,
})

export default Logger