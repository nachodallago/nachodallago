#!/bin/sh
# Corre la API de FC 26 (Node + SQLite) y nginx en el mismo contenedor.
# Si cualquiera de los dos se cae, el contenedor termina y Docker lo reinicia.
set -eu

node --disable-warning=ExperimentalWarning /app/fc26-api.mjs &
api=$!

nginx -g 'daemon off;' &
web=$!

trap 'kill -TERM "$api" "$web" 2>/dev/null; wait' TERM INT

while kill -0 "$api" 2>/dev/null && kill -0 "$web" 2>/dev/null; do
  sleep 5
done

echo "fc26: un proceso terminó, cerrando el contenedor" >&2
kill -TERM "$api" "$web" 2>/dev/null || true
wait
exit 1
