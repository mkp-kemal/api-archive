# ---- Base ----
FROM oven/bun:1 AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# ---- Build ----
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# ---- Production ----
FROM base AS prod
COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma

# Prisma Client must be generated at runtime
RUN bunx prisma generate

CMD ["bun", "run", "start:prod"]