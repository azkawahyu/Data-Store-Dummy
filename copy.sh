set -e  # stop kalau error

echo "📤 Upload ke server..."
rsync -avP backend.tar .env.docker .env deploy-prod.sh admin@172.30.28.186:/share/Web/apps/nextjs-app/

echo "✅ Deploy selesai!"