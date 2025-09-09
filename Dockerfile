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

# Copy package files & install deps production
COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile

# Copy build & prisma
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules ./node_modules

EXPOSE 5000

# Jalankan main JS hasil build
CMD ["bun", "dist/src/main.js"]
