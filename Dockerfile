# Stage 1: Build NestJS
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN npx prisma generate
RUN bun build

# Stage 2: Production
FROM node:18-alpine AS production
WORKDIR /usr/src/app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production --ignore-scripts

# Copy built files
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 5000

CMD ["node", "dist/src/main.js"]
