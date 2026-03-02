# Use the official Node.js image based on Windows Server Core
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install Nest.js dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the port your app runs on
EXPOSE 5173

# Command to run your application using npm
CMD ["npm", "run", "dev"]
