#use the node image from Official Docker Hub
FROM node:20.5.1-alpine3.17

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["node", "server.js"]

