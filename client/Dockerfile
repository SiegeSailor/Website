FROM node:23.11.0-alpine3.21 AS stage-base


# [Stage] Prepare system level dependencies and install packages
FROM stage-base AS stage-dependencies

LABEL org.opencontainers.image.authors="Jin Yu Zhang <siegesailor@gmail.com>"
LABEL org.opencontainers.image.title="website-client"

ENV DEBIAN_FRONTEND="noninteractive"

WORKDIR /main/

COPY "./package.json" "./package-lock.json" /main/

RUN npm ci


# [Stage] Build the application
FROM stage-dependencies AS stage-build

WORKDIR /main/

COPY --from=stage-dependencies /main/node_modules ./node_modules
COPY . .

RUN npm run build


# [Stage] Prepare the application and run the container
FROM stage-base AS stage-production

ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV="production"
ENV PORT="3000"

WORKDIR /main/

RUN addgroup --system --gid 1001 group && \
    adduser --system --uid 1001 user

COPY --from=stage-build /main/public ./public
COPY --from=stage-build --chown=user:group /main/.next/standalone ./
COPY --from=stage-build --chown=user:group /main/.next/static ./.next/static

USER user

EXPOSE "3000"

CMD ["node", "server.js"]