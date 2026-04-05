#!/usr/bin/env bash
set -e

REMOTE="admin@172.30.28.186:/share/Web/apps/nextjs-app/"

echo "📤 Upload source code..."

rsync -aP \
  --partial --append-verify \
  --delete \
  --exclude=".env" \
  --exclude="*.env" \
  --exclude="node_modules" \
  --exclude=".git" \
  --exclude=".next" \
  --exclude="*.tar" \
  ./ \
  $REMOTE

echo "📦 Upload docker images..."

rsync -avP backend.tar frontend.tar $REMOTE

echo "✅ Upload ke QNAP selesai!"