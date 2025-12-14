# Railway Dockerfile - Build from monorepo root
FROM node:22-alpine

# Install curl for healthchecks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy entire repo first (Railway needs this)
COPY . .

# Navigate to adk-nexus and install
WORKDIR /app/adk-nexus
RUN npm ci

# Build the application
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:${PORT:-5000}/health || exit 1

# Start with memory limit
CMD ["node", "--max-old-space-size=512", "dist/server.js"]

