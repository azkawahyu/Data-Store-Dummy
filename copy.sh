set -e  # stop kalau error

echo "📤 Upload ke server..."
rsync -azP \
  --update \
  --delete \
  --exclude=".env" \
  --exclude="*.env" \
  --exclude="node_modules" \
  --exclude=".git" \
  --exclude=".next" \
  ./
  admin@172.30.28.186:/share/Web/apps/nextjs-app/
  
echo "✅ Deploy selesai!"