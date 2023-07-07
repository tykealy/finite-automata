# Use a Node.js base image with the specified version
FROM node:20

# Set the working directory inside the Docker image
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Specify the command to start the Next.js development server
CMD ["npm", "run", "dev"]