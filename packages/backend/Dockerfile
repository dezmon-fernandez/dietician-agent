# Use Node.js 20 as base
FROM node:20-slim

# Install pnpm
RUN apt-get update && \
    apt-get install -y curl && \
    npm install -g pnpm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

COPY package.json ./

# Install dependencies
RUN pnpm install

# Copy prisma schema and migrations
COPY prisma ./prisma/

# Copy rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript code
RUN pnpm build

# Create entrypoint script
RUN echo '#!/bin/sh\n\
npx prisma migrate deploy\n\
exec pnpm start' > /app/entrypoint.sh && \
chmod +x /app/entrypoint.sh

# Expose port
EXPOSE 3000

# Set the entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]
