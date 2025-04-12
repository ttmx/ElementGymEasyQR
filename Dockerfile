# Use the official Bun image as the base image
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy the application files
COPY . .

# Install dependencies
RUN bun install

# Expose the port the application runs on
EXPOSE 3000

# Start the application
CMD ["bun", "run", "index.ts"]
