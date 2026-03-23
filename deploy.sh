#!/bin/bash
set -e
cd /var/www/ift/app

git pull origin main
npm ci --production=false
npx prisma generate
npx prisma migrate deploy    # never resets data
npm run build
pm2 restart ift-app --update-env

echo "Deploy complete."
