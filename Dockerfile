FROM node:20-buster

# Install ffmpeg and other system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm install --production

# Copy application files
COPY . .

# Create sessions directory
RUN mkdir -p sessions

# Expose port for Express server
EXPOSE 2050

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:2050/ || exit 1

# Start the bot with error handling
CMD ["node", "start.js"]
