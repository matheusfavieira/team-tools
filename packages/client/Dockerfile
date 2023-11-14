FROM oven/bun:alpine

WORKDIR /app

COPY package.json bun.lockb vite.config.ts .

RUN bun install

COPY . .

RUN bun run build

EXPOSE 4173

CMD ["bun", "run", "preview"]