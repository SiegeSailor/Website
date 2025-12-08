FROM node:25.2.1-bullseye AS stage-base

ARG COMMIT_SHORT

ENV LOCAL_COMMIT_SHORT="${COMMIT_SHORT}"

ENV DEBIAN_FRONTEND="noninteractive"

# [Stage] Prepare system level dependencies and install packages
FROM stage-base AS stage-dependencies

LABEL org.opencontainers.image.authors="Jin Yu Zhang <siegesailor@gmail.com>"
LABEL org.opencontainers.image.title="siegesailor-website/client"
LABEL org.opencontainers.image.description="SiegeSailor's personal website client image."
LABEL org.opencontainers.image.version="0.0.0"

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

COPY "./client/package.json" "./client/package-lock.json" /app/client/

WORKDIR /app/client/

RUN npm ci


# [Stage] Build the application
FROM stage-dependencies AS stage-build

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

COPY --from=stage-dependencies /app/client/node_modules/. /app/client/node_modules/
COPY "./client/." /app/client/
COPY "./.git/." /app/.git/

WORKDIR /app/client/

RUN npm run build


# [Stage] Prepare the application and run the container
FROM stage-base AS stage-production

ENV LOCAL_COMMIT_SHORT="${COMMIT_SHORT}"

ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV="production"
ENV PORT="3000"

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN addgroup --system --gid 1001 group && \
    adduser --system --uid 1001 user

COPY --from=stage-build --chown=user:group /app/client/public/. /app/client/public/
COPY --from=stage-build --chown=user:group /app/client/.next/standalone/. /app/client/
COPY --from=stage-build --chown=user:group /app/client/.next/static/. /app/client/.next/static/
COPY --from=stage-build --chown=user:group /app/.git/. /app/.git/

USER user

EXPOSE 3000

WORKDIR /app/client/

CMD ["node", "server.js"]