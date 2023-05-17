FROM node:18-alpine3.17

WORKDIR /usr/src/app

COPY package*.json ./

COPY . ./

RUN npm install

EXPOSE 3201
CMD [ "node", "dist/bin/server.js" ]