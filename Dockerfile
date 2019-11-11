FROM node:12-alpine
RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app

RUN apk add --no-cache redis
RUN apk add --no-cache screen
RUN npm install -g concurrently


WORKDIR /usr/src/app
COPY package.json ./
USER node
RUN npm install
COPY --chown=node:node . .

ARG RD_PORT
ENV RD_PORT=$RD_PORT

ARG RD_HOST
ENV RD_HOST=$RD_HOST

ARG RD_PASSWORD
ENV RD_PASSWORD=$RD_PASSWORD

ARG DB_HOST
ENV DB_HOST=$DB_HOST

ARG DB_NAME
ENV DB_NAME=$DB_NAME

ARG DB_USER
ENV DB_USER =$DB_USER

ARG DB_PASSWORD
ENV DB_PASSWORD=$DB_PASSWORD

EXPOSE 6969
EXPOSE 6379
CMD concurrently "redis-server" "sleep 5s; node /usr/src/app/app.js"
