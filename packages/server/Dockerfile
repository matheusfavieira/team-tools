FROM oven/bun:alpine

WORKDIR /app

COPY package.json bun.lockb .

RUN bun install

COPY . .

ARG CORS_ALLOW_ORIGIN

ENV CORS_ALLOW_ORIGIN=${CORS_ALLOW_ORIGIN:-http://localhost:4173}

EXPOSE 3000/tcp

CMD ["bun", "run", "index.ts"]