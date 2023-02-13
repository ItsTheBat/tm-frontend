FROM node:14.16.1-alpine3.13

# COPY [host] [container]
COPY package.json package-lock.json .

RUN npm install

COPY . .

RUN npm run build