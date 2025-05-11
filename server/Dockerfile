FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Create certs directory if self-signed certs are needed
RUN mkdir -p certs

# Expose both HTTP and HTTPS ports
EXPOSE 3000 3443

# Set NODE_ENV to production
ENV NODE_ENV=production

# Set health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

# Start the server
CMD ["npm", "start"] 