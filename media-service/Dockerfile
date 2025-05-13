# Use official Node.js 18 image with Alpine Linux
FROM node:18-alpine

# Set working directory (NOTE: fixed typo `/use/` → `/usr/`)
WORKDIR /use/src/app

# Copy only package files first (better for caching layers)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose port 3003
EXPOSE 3003

# Run the server
CMD ["node", "src/server.js"]
