#################################################################################################################################################	FROM ubuntu:18.04
# How to :	MAINTAINER Docker
# Build : sudo docker build \--build-arg PROTO_HOST='xxx.xxx.xx.xxx' \--build-arg PROTO_PORT=6000 \--build-arg PORT=9966 \-t kevinh2810/nodes-trial .
# Run : sudo docker run -p 8888:8888 -d kevinh2810/nodes-trial
# Remove : 'docker rm <image_id>
#################################################################################################################################################

FROM ubuntu:18.04
MAINTAINER Docker
RUN mkdir -p /usr/src/app && chown -R root:root /usr/src/app
USER root
RUN mkdir -p /data/db

RUN apt-get update && apt-get install -y gnupg
RUN apt-get -y install redis-server

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
RUN echo 'deb http://repo.mongodb.org/apt/ubuntu $(cat /etc/lsb-release | grep DISTRIB_CODENAME | cut -d= -f2)/mongodb-org/3.2'
RUN apt-get install -y mongodb
RUN mkdir -p /data/db

RUN apt-get -y install curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt-get -y install nodejs
RUN node -v
RUN npm -v

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY --chown=root:root . .

RUN mv .env.local .env

ARG PORT
ENV PORT=$PORT

ARG PROTO_HOST
ENV PROTO_HOST=$PROTO_HOST

ARG PROTO_PORT
ENV PROTO_PORT=$PROTO_PORT

EXPOSE $PORT
EXPOSE 6379
EXPOSE 27017

RUN mkdir ~/log
CMD mongod --fork --logpath ~/log/mongodb.log && redis-server --daemonize yes && node /usr/src/app/app.js
