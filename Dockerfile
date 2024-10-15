# Use an official Node image as the build stage
FROM node:22.9.0-slim AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the TypeScript files
RUN npm run build


# Use a smaller image for the final stage
FROM node:22.9.0-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./

# Expose port 8080
EXPOSE 8080

# Start the app
CMD ["npm", "run", "start"]
