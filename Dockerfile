FROM node:20-alpine
WORKDIR app
COPY package*.json ./
EXPOSE 8080 5000
RUN npm install
COPY . .
RUN npm run build
CMD [ "npm","run","dev:full" ]