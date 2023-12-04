# --- Build Stage ---
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# --- Production Stage ---
FROM node:18-slim

# Set the working directory
WORKDIR /app

# Copy only the built app and node_modules from the "builder" stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port 3000 for the app
EXPOSE 3000

# Start the application
CMD ["npm", "start"]