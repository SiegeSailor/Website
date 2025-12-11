# [Stage] Define variables
FROM node:25.2.1-bullseye AS base

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

ENV LOCAL_GROUP_ID="1001"
ENV LOCAL_USER_ID="1001"

ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV="production"
ENV PORT="3000"

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN addgroup --system --gid "${LOCAL_GROUP_ID}" group && \
    adduser --system --uid "${LOCAL_USER_ID}" user

COPY --from=build --chown=user:group /app/client/public/. /app/client/public/
COPY --from=build --chown=user:group /app/client/.next/standalone/. /app/client/
COPY --from=build --chown=user:group /app/client/.next/static/. /app/client/.next/static/
COPY --from=build --chown=user:group /app/.git/. /app/.git/

USER user

EXPOSE 3000

WORKDIR /app/client/

CMD ["node", "server.js"]