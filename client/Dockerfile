# [Stage] Prepare environment variables and global packages
FROM stage-base AS stage-foundation

LABEL org.opencontainers.image.authors="Jin Yu Zhang <JinYu.Zhang@coopersurgical.com>"
LABEL org.opencontainers.image.title="ATLAS-Linux-app"

# [Action] Define the port environment variables
ENV PORT_MONGODB="27017"
ENV PORT_TIMOTION="55101"
ENV PORT_WEB_CLIENT="3000"
ENV SERIAL_PORT_TIMOTION="/dev/ttyUSB0"

# [Action] Define the path environment variables
ENV PATH_SOURCE="$LIBDEV_PATH_USER/source"
ENV PATH_FEATURES="$PATH_SOURCE/features"
ENV PATH_SCHEMAS="$PATH_SOURCE/schemas"
ENV PATH_SYSTEM="$PATH_SOURCE/system"
ENV PATH_DYNAMIC="$LIBDEV_PATH_USER/dynamic"
ENV PATH_CLIENT="$PATH_DYNAMIC/client"
ENV PATH_DEFINITIONS="$PATH_DYNAMIC/_definitions"
ENV PATH_LOGS="$PATH_DYNAMIC/logs"
ENV PATH_OUTPUTS="$PATH_DYNAMIC/outputs"
ENV PATH_PACKAGES="$PATH_DYNAMIC/packages"
ENV PATH_TESTING="$LIBDEV_PATH_USER/testing"

ENV PYTHONPATH="$PYTHONPATH:$PATH_FEATURES:$PATH_DYNAMIC:$PATH_DEFINITIONS"
ENV NODE_PATH="$NODE_PATH:$PATH_FEATURES:$PATH_DYNAMIC:$PATH_DEFINITIONS"

ENV DEBIAN_FRONTEND="noninteractive"

USER "root"

WORKDIR "$PATH_SOURCE/"

COPY "./source/" "$PATH_SOURCE/"

RUN \
    # [Action] Update permissions
    mkdir --parent "$PATH_OUTPUTS/" "$PATH_PACKAGES" && \
    chmod --recursive "777" "$PATH_SOURCE/" "$PATH_DYNAMIC/" && \
    # [Action] Prepare Python
    cd "$PATH_PACKAGES/" && \
    pip install --quiet \
        --requirement "$PATH_FEATURES/_gateway/requirements.txt" \
        --requirement "$PATH_FEATURES/_iot/requirements.txt" \
        --requirement "$PATH_FEATURES/_link/requirements.txt" \
        --requirement "$PATH_FEATURES/_mq/requirements.txt" \
        --requirement "$PATH_FEATURES/_vista/requirements.txt" \
        --requirement "$PATH_FEATURES/timotion/requirements.txt" \
        --requirement "$PATH_SYSTEM/dependencies/requirements.txt" && \
    # [Action] Prepare NodeJS
    npm config set registry "https://$NPM_REGISTRY/" && \
    npm config set //$NPM_REGISTRY/:_authToken "$GROUP_DEPLOY_TOKEN" && \
    (while read _PACKAGE || [ -n "$_PACKAGE" ]; do \
        npm install --global "$_PACKAGE"; \
    done < "$PATH_SYSTEM/dependencies/packages.txt") && \
    # [Action] Prepare definitions
    bash "$PATH_SCHEMAS/build/main.sh" && \
    # [Action] Prepare MongoDB
    curl --fail --silent --show-error --location "https://www.mongodb.org/static/pgp/server-8.0.asc" | \
        sudo gpg -o "/usr/share/keyrings/mongodb-server-8.0.gpg" \
        --dearmor --yes && \
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list > /dev/null && \
    ln --no-target-directory "/bin/true" "/usr/bin/systemctl" && \
    apt-get update --yes && \
    apt-get upgrade --fix-missing --yes && \
    apt-get install --fix-broken --fix-missing --no-install-recommends --yes \
        # [Package] MongoDB
        mongodb-org=8.0.6 mongodb-org-database=8.0.6 mongodb-org-server=8.0.6 \
        mongodb-mongosh=2.5.0 mongodb-org-shell=8.0.6 mongodb-org-mongos=8.0.6 \
        mongodb-org-tools=8.0.6 mongodb-org-database-tools-extra=8.0.6 && \
    # [Action] Clean up package manager to reduce image sizes
    apt-get clean && \
    rm --recursive --force /var/lib/apt/lists/*


# [Stage] Prepare the client dependencies
FROM stage-foundation AS stage-modules

USER "root"

WORKDIR "$PATH_FEATURES/client/"

RUN npm install


# [Stage] Build the client application
FROM stage-foundation AS stage-build

USER "root"

WORKDIR "$PATH_FEATURES/client/"

COPY --from=stage-modules "/home/user/source/features/client/node_modules/" "./node_modules/"

RUN node "make-tsconfig.js" && \
    npm run build


# [Stage] Prepare the client application and run the container
FROM stage-foundation AS stage-production

ENV NEXT_TELEMETRY_DISABLED="1"
ENV NODE_ENV="$LIBDEV_ENVIRONMENT"
ENV NODE_EXTRA_CA_CERTS="$LIBDEV_PATH_SECRETS/rootCA.pem"
ENV PORT="$PORT_WEB_CLIENT"

USER "root"

WORKDIR "$PATH_CLIENT/"

COPY --from=stage-build --chown="$LIBDEV_CONTAINER_USER:$LIBDEV_CONTAINER_USER" "/home/user/source/features/client/.next/standalone/" "./"
COPY --from=stage-build --chown="$LIBDEV_CONTAINER_USER:$LIBDEV_CONTAINER_USER" "/home/user/source/features/client/.next/static/" "./.next/static/"
COPY --from=stage-modules --chown="$LIBDEV_CONTAINER_USER:$LIBDEV_CONTAINER_USER" "/home/user/source/features/client/public/" "./public/"

RUN chmod --recursive "777" "./" "$PATH_FEATURES/client/" && \
    # [Action] Append startup scripts to the container user profile
    echo "" >> "$LIBDEV_PATH_USER/.profile" && \
    cat "$PATH_SYSTEM/.profile" >> "$LIBDEV_PATH_USER/.profile"

USER "$LIBDEV_CONTAINER_USER"

WORKDIR "$PATH_SOURCE/"

CMD supervisord --configuration "$PATH_SYSTEM/supervisor/supervisord.conf"

# [Stage] Prepare test dependencies
FROM stage-production AS stage-testing

USER "root"

WORKDIR "$LIBDEV_PATH_HOME/"

COPY --chown="$LIBDEV_CONTAINER_USER:$LIBDEV_CONTAINER_USER" "./testing/" "$PATH_TESTING/"

RUN apt-get update --yes && \
    apt-get upgrade --fix-missing --yes && \
    apt-get install --fix-broken --fix-missing --no-install-recommends --yes \
        # [Package] Bats
        parallel \
        # [Package] Ruby
        ruby-full && \
    # [Action] Clean up package manager to reduce image sizes
    apt-get clean && \
    rm --recursive --force /var/lib/apt/lists/* && \
    # [Action] Prepare Bash test dependencies
    gem install bashcov --version 3.1.3 && \
    gem install simplecov --version 0.22.0 && \
    gem install simplecov-cobertura --version 2.1.0 && \
    gem install simplecov-html --version 0.13.1 && \
    git clone --depth "1" "https://github.com/bats-core/bats-core.git" \
        "$LIBDEV_PATH_MODULES/bats-core/" && \
    (cd "$LIBDEV_PATH_MODULES/bats-core/" && \
        ./install.sh "$LIBDEV_PATH_PACKAGES/") && \
    # [Action] Install Python test dependencies
    pip install --user --quiet \
        --requirement "$PATH_TESTING/python/requirements.txt" && \
    # [Action] Update the directory permissions
    chmod --recursive "777" "$PATH_SOURCE/" "$PATH_DYNAMIC/"

USER "$LIBDEV_CONTAINER_USER"

WORKDIR "$PATH_TESTING/"

CMD bash "$PATH_TESTING/main.sh"