# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Install dependencies OS untuk Prisma
RUN apk add --no-cache libc6-compat openssl

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# Prisma: generate dengan binaryTargets untuk Alpine
RUN npx prisma generate

RUN yarn build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /usr/src/app

# OS deps
RUN apk add --no-cache libc6-compat openssl

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 5000

CMD ["node", "dist/src/main.js"]
