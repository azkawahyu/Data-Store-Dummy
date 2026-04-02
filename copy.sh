set -e  # stop kalau error

echo "📤 Upload ke server..."
rsync -avP docker-compose.prod.yml docker-compose.yml Dockerfile.api package.json prisma.config.ts backend/bootstrap.ts backend/tsup.config.ts backend/routes/auth.ts admin@172.30.28.186:/share/Web/apps/nextjs-app/

echo "✅ Deploy selesai!"