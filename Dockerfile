# Stage 1: Build NestJS
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copy package file & install deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client & build app
RUN npx prisma generate
RUN yarn build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /usr/src/app

# Copy dependencies (production only)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copy built files
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 5000

# Run the app
CMD ["node", "dist/src/main.js"]