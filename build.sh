#!/bin/bash

set -e  # stop kalau error


echo "🚀 Build image..."
sudo docker buildx build \
  --platform linux/arm64 \
  -f Dockerfile.api \
  -t my-backend \
  --load .

echo "📦 Save image..."
sudo docker save my-backend > backend.tar