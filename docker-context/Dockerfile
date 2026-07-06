# [Stage] Define variables
FROM node:26.4.0-bookworm@sha256:35d3b83382381e0e2f1d066b98aba486a4fab481a241c7516389635b88d927c1 AS base

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

LABEL org.opencontainers.image.authors="Jin Yu Zhang <siegesailor@gmail.com>"
LABEL org.opencontainers.image.title="siegesailor-website/resume"
LABEL org.opencontainers.image.description="SiegeSailor's resume builder image."

ENV DEBIAN_FRONTEND="noninteractive"

WORKDIR /app

# [Stage] Prepare system level dependencies and install packages
FROM base AS dependencies

COPY "package.json" "package-lock.json" ./

RUN npm ci


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
COPY "scripts/build-readme.mjs" ./scripts/build-readme.mjs

# Builds export/resume/*.{docx,pdf,txt} and export/SiegeSailor-README.md. The
# README picks up project versions from files/resume/versions.generated.json
# when the host generated it before the image build (else it falls back to stage).
RUN npm run build:resume && npm run build:readme
