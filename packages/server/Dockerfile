FROM oven/bun:alpine

WORKDIR /app

COPY package.json bun.lockb .

RUN bun install

COPY . .

EXPOSE 3000/tcp

CMD ["bun", "run", "index.ts"]