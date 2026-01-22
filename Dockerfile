# Development Dockerfile with hot reload support
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies for better compatibility
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the Next.js development port
EXPOSE 3000

# Start Next.js in development mode with hot reload
CMD ["npm", "run", "dev"]
