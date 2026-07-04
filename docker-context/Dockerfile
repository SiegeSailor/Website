# [Stage] Define variables
FROM node:26.4.0-bookworm@sha256:35d3b83382381e0e2f1d066b98aba486a4fab481a241c7516389635b88d927c1 AS base

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ARG COMMIT_SHORT
ARG VERSION="0.0.0"

LABEL org.opencontainers.image.authors="Jin Yu Zhang <siegesailor@gmail.com>"
LABEL org.opencontainers.image.title="siegesailor-website/client"
LABEL org.opencontainers.image.description="SiegeSailor's personal website client image."
LABEL org.opencontainers.image.version="${VERSION}"

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


# [Stage] Build the resume documents
FROM dependencies AS resume

RUN apt-get update && \
    apt-get install --no-install-recommends --yes \
    fonts-crosextra-carlito \
    libreoffice-writer \
    pandoc \
    poppler-utils && \
    rm -rf /var/lib/apt/lists/*

COPY "files/resume/" ./files/resume/
COPY "scripts/build-resume.mjs" ./scripts/build-resume.mjs

RUN npm run build:resume


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
COPY --from=resume --chown="${USERNAME}:${GROUP_NAME}" /app/export/resume/. ./public/documents/
COPY --from=build --chown="${USERNAME}:${GROUP_NAME}" /app/.next/standalone/. ./
COPY --from=build --chown="${USERNAME}:${GROUP_NAME}" /app/.next/static/. ./.next/static/

EXPOSE 3000

CMD ["node", "server.js"]