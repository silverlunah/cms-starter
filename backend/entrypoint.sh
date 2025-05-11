#!/bin/sh

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready on mysql:3306..."
until nc -z mysql 3306; do
  echo "Waiting for MySQL..."
  sleep 1
done

echo "MySQL is up — running prisma generate..."

# Generate Prisma client (ensure the client is generated before seeding)
npx prisma generate

echo "Prisma generate complete. Running migrations..."

# Run migrations
npx prisma migrate deploy

echo "Migrations complete. Running seeders..."

# Run database seeding
npx prisma db seed || echo "No seed data to run."

echo "Seeding complete. Building the app..."

# Build the backend
npm run build

echo "Build complete. Starting the app..."

# Start the Fastify server (assuming you are running a compiled JS file after build)
exec node build/index.js
