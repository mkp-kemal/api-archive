# Stage 1: Build NestJS
FROM oven/bun:1 AS builder
WORKDIR /usr/src/app

# Copy package file & bun lock
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Generate prisma client & build app
RUN bunx prisma generate
RUN bun run build

# Stage 2: Production
FROM oven/bun:1 AS production
WORKDIR /usr/src/app

# Copy deps (gunakan --production untuk lebih ringan)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Copy built files
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 5000

CMD ["node", "dist/src/main.js"]
