FROM oven/bun:slim

WORKDIR /app

COPY tsconfig.json .
COPY .env.prod .env
COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY src src

ENV NODE_ENV production
CMD ["bun", "src/index.ts"]

EXPOSE 3000