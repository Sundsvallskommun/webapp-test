FROM node:20-slim AS deps
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile

FROM node:20-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM node:20-slim AS proddeps
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile --production --ignore-scripts

COPY prisma ./prisma
RUN npx prisma generate

FROM node:20-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*

RUN groupadd -r nodejs && useradd -r -g nodejs nodejs

COPY --from=proddeps /app/node_modules ./node_modules
COPY --from=proddeps /app/prisma ./prisma

COPY --from=build /app/dist ./dist

USER nodejs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "dist/server.js"]
