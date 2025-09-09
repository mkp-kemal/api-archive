# Stage 1: Build NestJS
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN npx prisma generate
RUN yarn build

# Stage 2: Production
FROM node:18-alpine AS production
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production --ignore-scripts

# Copy built files
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 5000

CMD ["node", "dist/src/main.js"]
