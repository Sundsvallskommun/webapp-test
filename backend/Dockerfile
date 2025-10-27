FROM node:18-slim AS deps
RUN apt-get update
RUN apt-get install -y openssl
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:18-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

FROM node:18-slim AS runner
RUN apt-get update
RUN apt-get install -y openssl
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder --chown=nodejs:nodejs /app/ ./

USER nodejs

EXPOSE 3000
ENV PORT 3000

RUN yarn run prisma:generate
RUN yarn run prisma:migrate
CMD ["node", "./dist/server.js"]
