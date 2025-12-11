# [Stage] Define variables
FROM node:25.2.1-bullseye@sha256:72d57f156e8f03e98b0d9a6fef7d76c64a4ed197404a40c2d7119eb6357e78ce AS base

ARG COMMIT_SHORT

ENV LOCAL_COMMIT_SHORT="${COMMIT_SHORT}"

ENV DEBIAN_FRONTEND="noninteractive"

# [Stage] Prepare system level dependencies and install packages
FROM base AS dependencies

LABEL org.opencontainers.image.authors="Jin Yu Zhang <siegesailor@gmail.com>"
LABEL org.opencontainers.image.title="siegesailor-website/client"
LABEL org.opencontainers.image.description="SiegeSailor's personal website client image."
LABEL org.opencontainers.image.version="0.0.0"

COPY "./client/package.json" "./client/package-lock.json" /app/client/

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

WORKDIR /app/client/

RUN npm ci


# [Stage] Build the application
FROM dependencies AS build

COPY --from=dependencies /app/client/node_modules/. /app/client/node_modules/
COPY "./client/." /app/client/
COPY "./.git/." /app/.git/

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

WORKDIR /app/client/

RUN npm run build


# [Stage] Prepare the application and run the container
FROM base AS production

ENV LOCAL_GROUP_NAME="group"
ENV LOCAL_USER_GID="1001"
ENV LOCAL_USER_UID="1001"
ENV LOCAL_USERNAME="user"

ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV="production"
ENV PORT="3000"

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN addgroup --system --gid "${LOCAL_USER_GID}" "${LOCAL_GROUP_NAME}" && \
    adduser --system --uid "${LOCAL_USER_UID}" "${LOCAL_USERNAME}"

COPY --from=build --chown="${LOCAL_USERNAME}:${LOCAL_GROUP_NAME}" /app/client/public/. /app/client/public/
COPY --from=build --chown="${LOCAL_USERNAME}:${LOCAL_GROUP_NAME}" /app/client/.next/standalone/. /app/client/
COPY --from=build --chown="${LOCAL_USERNAME}:${LOCAL_GROUP_NAME}" /app/client/.next/static/. /app/client/.next/static/
COPY --from=build --chown="${LOCAL_USERNAME}:${LOCAL_GROUP_NAME}" /app/.git/. /app/.git/

USER "${LOCAL_USERNAME}"

EXPOSE "${PORT}"

WORKDIR /app/client/

CMD ["node", "server.js"]