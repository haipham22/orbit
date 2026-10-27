FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
# client.ts validate DATABASE_URL lúc import — build chỉ import module, không query
ENV DATABASE_URL=postgres://build:build@localhost:5432/build
RUN pnpm build

FROM base AS run
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
RUN mkdir -p /app/.next && chown -R node:node /app
COPY --from=build --chown=node:node /app/.next/standalone /app
COPY --from=build --chown=node:node /app/.next/static /app/.next/static
COPY --from=build --chown=node:node /app/public /app/public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
