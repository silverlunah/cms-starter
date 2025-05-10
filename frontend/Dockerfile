# Use official Node.js image
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app for production
RUN npm run build

# Expose the port your app runs on (match to the one in your adapter config)
EXPOSE 3002

# Start the production SvelteKit server (not Vite preview)
CMD ["sh", "-c", "PORT=3002 node build"]

