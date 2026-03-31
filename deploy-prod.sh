#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.docker"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  echo "Copy .env.docker.example to .env.docker first."
  exit 1
fi

echo "[1/5] Starting database"
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d postgres

echo "[2/5] Building backend image"
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" build backend

echo "[3/5] Starting backend"
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d backend

echo "[4/5] Waiting for backend health"
for i in {1..60}; do
  if docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" exec -T backend curl -fsS http://127.0.0.1:4000/health >/dev/null 2>&1; then
    echo "Backend is healthy"
    break
  fi

  if [[ "$i" -eq 60 ]]; then
    echo "Backend logs:"
    docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" logs --no-color --tail 100 backend || true
    echo "Backend did not become healthy in time"
    exit 1
  fi

  sleep 5
done

echo "[5/5] Building and starting frontend"
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" build web
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d web

docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d pgadmin

echo "Deployment complete"
