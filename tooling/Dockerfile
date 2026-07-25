FROM node:26.5.0-trixie-slim@sha256:715e55e4b84e4bb0ff48e49b398a848f08e55daed8eb6a0ea1839ae53bc57583 AS base

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

LABEL org.opencontainers.image.authors="Jin Yu Zhang <siegesailor@gmail.com>"
LABEL org.opencontainers.image.title="siegesailor-website/tooling"
LABEL org.opencontainers.image.description="SiegeSailor's resume document and profile README builder."

ENV DEBIAN_FRONTEND="noninteractive"

WORKDIR /app

# [Stage] Install packages
FROM base AS dependencies

# The build context is the repository root; the root manifests carry the workspace
# resolution and the version stamped into the documents.
COPY "package.json" "package-lock.json" ./
COPY "tooling/package.json" ./tooling/

# --ignore-scripts: the root `prepare` runs Husky, which needs a .git directory
# that is deliberately outside the context.
RUN npm ci --workspace tooling --omit=dev --ignore-scripts


# [Stage] Build the resume documents
FROM dependencies AS resume

# Debian drops superseded versions from the mirror, so exact pins only stay
# resolvable against snapshot.debian.org, which also freezes the transitive
# closure and keeps the rendered page counts reproducible. The default timestamp
# is the one the base image was built against; bump it with the pins below.
ARG DEBIAN_SNAPSHOT="20260713T000000Z"

# Snapshot Release files always look stale, hence Check-Valid-Until=false.
RUN printf '%s\n' \
        "Types: deb" \
        "URIs: http://snapshot.debian.org/archive/debian/${DEBIAN_SNAPSHOT}" \
        "Suites: trixie trixie-updates" \
        "Components: main" \
        "Signed-By: /usr/share/keyrings/debian-archive-keyring.pgp" \
        "" \
        "Types: deb" \
        "URIs: http://snapshot.debian.org/archive/debian-security/${DEBIAN_SNAPSHOT}" \
        "Suites: trixie-security" \
        "Components: main" \
        "Signed-By: /usr/share/keyrings/debian-archive-keyring.pgp" \
        > /etc/apt/sources.list.d/debian.sources && \
    apt-get -o Acquire::Check-Valid-Until="false" -o Acquire::Retries="3" update && \
    apt-get install --no-install-recommends --yes -o Acquire::Retries="3" \
        fonts-crosextra-carlito="20230309-2" \
        libreoffice-writer="4:25.2.3-2+deb13u6" \
        pandoc="3.1.11.1+ds-2" \
        poppler-utils="25.03.0-5+deb13u4" && \
    rm -rf /var/lib/apt/lists/*

COPY "content/" ./content/
COPY "tooling/scripts/" ./tooling/scripts/

# Project versions come from content/versions.generated.json when the host
# generated it before the build; otherwise the README falls back to the stage.
RUN npm run build:resume --workspace tooling && \
    npm run build:readme --workspace tooling
