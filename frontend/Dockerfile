# Use the official Node image from the Docker Hub
FROM node:18-alpine

# Set work directory
WORKDIR /react-app

# Copy package.json and package-lock.json first
COPY ecommerce/package.json ecommerce/package-lock.json /react-app/

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY ecommerce /react-app/

# Expose the port the app runs on
EXPOSE 5173

