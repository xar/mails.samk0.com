# Use Node.js LTS version
FROM node:20-alpine

# Install PM2 globally and SQLite dependencies
RUN apk add --no-cache \
    curl \
    bash \
    sqlite \
    sqlite-dev \
    python3 \
    make \
    g++ \
    && npm install -g pm2

# Create app directory
WORKDIR /app

# Create directory for SQLite database and ensure correct permissions
RUN mkdir -p /app/data/db && \
    chmod 777 /app/data/db

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

RUN npm install @libsql/linux-x64-musl

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Set environment variable to production
ENV NODE_ENV=production
ENV NUXT_DB_FILE_NAME=file:/app/data/db/sqlite.db

# Create PM2 configuration with updated environment
RUN echo '{\
  "apps": [{\
    "name": "nuxt-app",\
    "script": ".output/server/index.mjs",\
    "instances": 1,\
    "exec_mode": "cluster",\
    "max_memory_restart": "500M",\
    "env": {\
      "NODE_ENV": "production",\
      "NUXT_DB_FILE_NAME": "file:/app/data/db/sqlite.db"\
    },\
    "merge_logs": true,\
    "log_date_format": "YYYY-MM-DD HH:mm:ss",\
    "error_file": "/app/logs/error.log",\
    "out_file": "/app/logs/access.log"\
  }]}\
' > /app/ecosystem.config.json

# Create logs directory
RUN mkdir -p /app/logs

# Start the application with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.json"]