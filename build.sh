#!/bin/bash

set -e  # stop kalau error


echo "🚀 Build backend image..."
sudo docker buildx build \
  --platform linux/arm64 \
  -f Dockerfile.api \
  -t my-backend \
  --load .

echo "✅ Finished building backend image..."

echo "📦 Start saving backend image to tar"
sudo docker save my-backend > backend.tar
echo "✅ Finished saving backend image to tar"


echo "🚀 Build frontend image..."
sudo docker buildx build \
  --platform linux/arm64 \
  -f Dockerfile.web \
  -t my-frontend \
  --load .

echo "✅ Finished building frontend image..."

echo "📦 Start saving frontend image to tar"
sudo docker save my-frontend > frontend.tar
echo "✅ Finished saving frontend image to tar"
