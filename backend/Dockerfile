FROM node:20-alpine AS builder
RUN apk update && apk add --no-cache openssl # Use openssl 3.x from base image

WORKDIR /app
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl-arm64-openssl-3.0.x
ENV PRISMA_CLIENT_ENGINE_TYPE=binary

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the code
COPY . .

# Configure Prisma to use OpenSSL 3.0.x
# ENV PRISMA_CLI_BINARY_TARGETS=linux-musl-arm64-openssl-3.0.x (Moved up)
# ENV PRISMA_CLIENT_ENGINE_TYPE=binary (Moved up)

# Generate Prisma client with the updated schema
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install OpenSSL
RUN apk update && apk add --no-cache openssl # Use openssl 3.x from base image

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy Prisma schema for migrations
COPY prisma ./prisma/

# Copy build from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Configure Prisma to use OpenSSL 3.0.x
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl-arm64-openssl-3.0.x
ENV PRISMA_CLIENT_ENGINE_TYPE=binary

# Create logs directory and set permissions
RUN mkdir -p logs && chmod 777 logs

# Expose the port the app runs on
EXPOSE 8000

# Create and set a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Command to run the application
CMD ["npm", "start"] 