```
helper_substitute() {
    local _FILE_INPUT="$1"
    local _FILE_OUTPUT="$2"

    local _FILE_SUBSTITUTED="$_FILE_OUTPUT.substituted"

    envsubst < "$_FILE_INPUT" | sudo tee "$_FILE_SUBSTITUTED" > /dev/null
    sed 's/__DOLLAR__/$/g' "$_FILE_SUBSTITUTED" | sudo tee "$_FILE_OUTPUT" > /dev/null
    sudo rm "$_FILE_SUBSTITUTED"
}
```

```
rabbitmq() {
    if [ "$LIBDEV_IS_ENABLED_MQ" = "false" ]; then \
        echo "MQ is not enabled."

        return 1
    fi

    set -o errexit

    while sudo rabbitmqctl status > /dev/null 2>&1; do
        helper_log "Stop previous started RabbitMQ servers."
        sudo rabbitmqctl stop > /dev/null 2>&1
        sleep 1
    done

    export LIBDEV_RABBITMQ_PASSWORD_HASHED=$(sudo rabbitmqctl hash_password "$LIBDEV_RABBITMQ_PASSWORD")
    helper_substitute "$LIBDEV_PATH_FEATURES/mq/definitions.json" "/etc/rabbitmq/definitions.json"
    export RABBITMQ_SERVER_START_ARGS="--load-definitions=/etc/rabbitmq/definitions.json"
    sudo mkdir --parent "/etc/rabbitmq/conf.d/"
    sudo cp "$LIBDEV_PATH_FEATURES/mq/rabbitmq.basic.conf" "/etc/rabbitmq/conf.d/"
    export RABBITMQ_CONFIG_FILES="/etc/rabbitmq/conf.d/"
    sudo cp "$LIBDEV_PATH_FEATURES/mq/enabled_plugins" "/etc/rabbitmq/"
    export RABBITMQ_ENABLED_PLUGINS_FILE="/etc/rabbitmq/enabled_plugins"
    sudo chmod "777" --recursive "/etc/rabbitmq/"

    trap "sudo rabbitmqctl stop > /dev/null 2>&1; exit 0" EXIT

    helper_log "Start RabbitMQ server."
    sudo rabbitmq-server

    return 0
}
```

```
mq() {
    if [ "$LIBDEV_IS_ENABLED_MQ" = "false" ]; then \
        echo "MQ is not enabled."

        return 1
    fi

    while ! sudo service avahi-daemon status > /dev/null 2>&1; do
        helper_log "Waiting for Avahi server to start."
        sleep 1
    done

    # helper_log "Bind 'eth0' and 'docker0' with mDNS repeater."
    # sudo mdns-repeater "eth0" "docker0" > /dev/null
    # if [ $? -ne 0 ]; then
    #     helper_log "Bind 'eno0' and 'docker0' with mDNS repeater."
    #     sudo mdns-repeater "eno0" "docker0" > /dev/null
    # fi
    # Tested with:
    # sudo apt-get update && sudo apt-get install -y tcpdump && sudo tcpdump -i eth0 | grep 9001
    # When mdns-repeater is up:
    #  - eth0 and docker0 don't have traffic for 15672
    #  - docker0 don't have traffic for 9001
    #  - eth0 have traffic for 9001
    # When mdns-repeater is down:
    #  - eth0 have traffic for 9001 and 15672
    #  - docker0 don't have traffic for 9001 and 15772

    # First time server starts will result in MQ starts,
    # Then publish method will try to act before permissions are set,
    # therefore an ACCESS DENIED error is raised.
    while ! sudo rabbitmqctl status > /dev/null 2>&1 || \
        ! sudo rabbitmqctl list_users | grep --quiet "$LIBDEV_RABBITMQ_USER" | grep --quiet "administrator"; do
        helper_log "Waiting for RabbitMQ server to configure."

        sleep 1
    done

    set -o errexit

    python "$LIBDEV_PATH_FEATURES/mq/"

    return 0
}

avahi() {
    if [ "$LIBDEV_IS_ENABLED_MQ" = "false" ]; then \
        echo "MQ is not enabled."

        return 1
    fi

    set -o errexit

    trap "sudo service avahi-daemon stop; exit 0" EXIT

    if ! sudo service dbus status > /dev/null; then
        helper_log "Start D-Bus."
        sudo service dbus start > /dev/null
    fi

    cat "$LIBDEV_PATH_FEATURES/mq/avahi-daemon.conf" | sudo tee /etc/avahi/avahi-daemon.conf > /dev/null

    helper_log "Start Avahi server."
    sudo avahi-daemon > /dev/null

    return 0
}

rabbitmq() {
    if [ "$LIBDEV_IS_ENABLED_MQ" = "false" ]; then \
        echo "MQ is not enabled."

        return 1
    fi

    while sudo rabbitmqctl status > /dev/null 2>&1; do
        helper_log "Stop previous started RabbitMQ servers."
        sudo rabbitmqctl stop > /dev/null 2>&1
        sleep 1
    done

    trap "sudo rabbitmqctl stop > /dev/null 2>&1; exit 0" EXIT

    helper_log "Start RabbitMQ server."
    sudo rabbitmq-server -detached > /dev/null

    while ! sudo rabbitmqctl status > /dev/null 2>&1; do
        helper_log "Waiting for RabbitMQ server to start."
        sleep 1
    done

    helper_log "Configure RabbitMQ server."
    sudo rabbitmqctl add_user "$LIBDEV_RABBITMQ_USER" "$LIBDEV_RABBITMQ_PASSWORD" > /dev/null 2>&1
    sudo rabbitmqctl set_user_tags "$LIBDEV_RABBITMQ_USER" "administrator" > /dev/null 2>&1

    sudo rabbitmq-plugins enable rabbitmq_management > /dev/null 2>&1

    set -o errexit

    sudo rabbitmqctl set_log_level "error" > /dev/null
    sudo rabbitmqctl set_permissions --vhost "/" "$LIBDEV_RABBITMQ_USER" ".*" ".*" ".*" > /dev/null

    helper_log "Stop RabbitMQ server."
    sudo rabbitmqctl stop > /dev/null 2>&1

    helper_log "Restart RabbitMQ server."
    sudo rabbitmq-server > /dev/null

    return 0
}
```
