#!/bin/bash

set -e  # stop kalau error


echo "🚀 Build backend image..."
sudo docker buildx build \
  --platform linux/arm64 \
  -f Dockerfile.api \
  -t my-backend \
  --load .

echo "📦 Save backend image..."
sudo docker save my-backend > backend.tar

echo "🚀 Build frontend image..."
sudo docker buildx build \
  --platform linux/arm64 \
  -f Dockerfile.web \
  -t my-frontend \
  --load .

echo "📦 Save frontend image..."
sudo docker save my-frontend > frontend.tar