FROM node:20-alpine

WORKDIR /app

# Copy only dependency files
COPY package*.json ./

# Install all dependencies (including dev, because you need tsc)
RUN npm install

# Copy the whole backend folder
COPY . .

# Build TypeScript -> dist/
RUN npm run build

# Expose backend port
EXPOSE 5000

# Run the compiled JS
CMD ["node", "dist/server.js"]

