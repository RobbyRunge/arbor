#!/bin/bash
set -e

ARBOR_DIR="$(cd "$(dirname "$0")" && pwd)"
VENV="$ARBOR_DIR/backend/.venv/bin/activate"

cleanup() {
    echo "Stopping servers..."
    kill "$DJANGO_PID" "$FRONTEND_PID" 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM

echo "Starting containers..."
cd "$ARBOR_DIR"
if command -v podman-compose &>/dev/null; then
    podman system check --repair
    podman-compose up -d
elif command -v docker &>/dev/null; then
    docker compose up -d
else
    echo "Error: neither podman-compose nor docker found"
    exit 1
fi

echo "Starting Django dev server..."
source "$VENV"
cd "$ARBOR_DIR/backend"
python manage.py runserver &
DJANGO_PID=$!

echo "Starting frontend..."
cd "$ARBOR_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

wait "$DJANGO_PID" "$FRONTEND_PID"
