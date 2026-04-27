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

echo "Checking Podman storage..."
podman system check --repair

echo "Starting containers..."
cd "$ARBOR_DIR"
podman-compose up -d

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
