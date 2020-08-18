#!/usr/bin/env sh
set -eu

envsubst '${API_URL} ${OSS_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"
