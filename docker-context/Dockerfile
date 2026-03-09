# [Stage] Define variables
FROM node:25.2.1-bullseye@sha256:72d57f156e8f03e98b0d9a6fef7d76c64a4ed197404a40c2d7119eb6357e78ce AS base

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ARG COMMIT_SHORT

LABEL org.opencontainers.image.authors="Jin Yu Zhang <siegesailor@gmail.com>"
LABEL org.opencontainers.image.title="siegesailor-website/client"
LABEL org.opencontainers.image.description="SiegeSailor's personal website client image."
LABEL org.opencontainers.image.version="0.0.0"

ENV COMMIT_SHORT="${COMMIT_SHORT}"

ENV DEBIAN_FRONTEND="noninteractive"

WORKDIR /app

# [Stage] Prepare system level dependencies and install packages
FROM base AS dependencies

COPY "package.json" "package-lock.json" ./

RUN npm ci


# [Stage] Build the application
FROM dependencies AS build

COPY --from=dependencies /app/node_modules/. ./node_modules/
COPY "." ./

RUN npm run build:server


# [Stage] Prepare the application and run the container
FROM base AS production

ENV GROUP_NAME="group"
ENV USER_GID="1001"
ENV USER_UID="1001"
ENV USERNAME="user"

ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV="production"
ENV PORT="3000"

RUN addgroup --system --gid "${USER_GID}" "${GROUP_NAME}" && \
    adduser --system --uid "${USER_UID}" "${USERNAME}"

USER "${USERNAME}"

COPY --from=build --chown="${USERNAME}:${GROUP_NAME}" /app/public/. ./public/
COPY --from=build --chown="${USERNAME}:${GROUP_NAME}" /app/.next/standalone/. ./
COPY --from=build --chown="${USERNAME}:${GROUP_NAME}" /app/.next/static/. ./.next/static/

EXPOSE 3000

CMD ["node", "server.js"]