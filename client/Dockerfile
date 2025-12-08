FROM node:25.2.1-bullseye AS stage-base

ARG COMMIT_SHORT

# [Stage] Prepare system level dependencies and install packages
FROM stage-base AS stage-dependencies

LABEL org.opencontainers.image.authors="Jin Yu Zhang <siegesailor@gmail.com>"
LABEL org.opencontainers.image.title="siegesailor-website/client"
LABEL org.opencontainers.image.description="SiegeSailor's personal website client image."
LABEL org.opencontainers.image.version="0.0.0"

ENV LOCAL_COMMIT_SHORT="${COMMIT_SHORT}"

ENV DEBIAN_FRONTEND="noninteractive"

WORKDIR /app/

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

COPY "./package.json" "./package-lock.json" /app/

RUN npm ci


# [Stage] Build the application
FROM stage-dependencies AS stage-build

WORKDIR /app/

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

COPY --from=stage-dependencies /app/node_modules ./node_modules
COPY . .

RUN npm run build


# [Stage] Prepare the application and run the container
FROM stage-base AS stage-production

ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV="production"
ENV PORT="3000"

WORKDIR /app/

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN addgroup --system --gid 1001 group && \
    adduser --system --uid 1001 user

COPY --from=stage-build /app/public ./public
COPY --from=stage-build --chown=user:group /app/.next/standalone ./
COPY --from=stage-build --chown=user:group /app/.next/static ./.next/static

USER user

EXPOSE 3000

CMD ["node", "server.js"]