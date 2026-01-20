FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Set default environment variables (will be overridden by docker-compose)
ENV NODE_ENV=development
ENV PORT=5000
ENV DB_HOST=db
ENV DB_USERNAME=support
ENV DB_PASSWORD=support
ENV DB_NAME=support

# Install wait-for-db dependencies (mysql2 is already in package.json)
# Start the application with database wait
CMD ["sh", "-c", "node wait-for-db.js && npm start"]
