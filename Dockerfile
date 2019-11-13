<<<<<<< HEAD
FROM ubuntu:18.04
RUN mkdir -p /usr/src/app && chown -R root:root /usr/src/app
USER root

RUN apt-get update && apt-get install -y gnupg
RUN apt-get -y install redis-server

#==========MONGO DB============================================================================================================================
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
# RUN echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | tee /etc/apt/sources.list.d/mongodb.list
RUN apt-get install -y mongodb
#======================================================================================================================================

# install curl
RUN apt-get -y install curl
# get install script and pass it to execute:
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
# and install node
RUN apt-get -y install nodejs
# confirm that it was successful
RUN node -v
# npm installs automatically
RUN npm -v

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY --chown=root:root . .

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
CMD  node /usr/src/app/app.js;service mongod start;redis-server
=======
#################################################################################################################################################
# How to :
# Build : docker build -t zoobc-exp-api:9696 --build-arg PORT=9696 --build-arg DB_NAME="zoobcdb_testnet_5000" --build-arg PROTO_HOST="18.139.3.139" --build-arg PROTO_PORT=5000 --no-cache .
# Run : docker run --name zoobc-exp-api-9696 -d -p 9696:9696 zoobc-exp-api:9696
# Remove : docker rm -f zoobc-exp-api-9696
#################################################################################################################################################

FROM node:10

WORKDIR /usr/src/app
COPY . .

RUN npm install

ARG PORT
ENV PORT=$PORT

ARG DB_NAME
ENV DB_NAME=${DB_NAME}

ARG PROTO_HOST
ENV PROTO_HOST=$PROTO_HOST

ARG PROTO_PORT
ENV PROTO_PORT=PROTO_PORT

CMD PORT=${PORT} DB_NAME=${DB_NAME} PROTO_HOST=${PROTO_HOST} PROTO_PORT=${PROTO_PORT} node app.js

# EXPOSE 9696
# CMD ["npm", "run", "start"]
>>>>>>> a6a044eaabbccd1188a2e83247f5a49fe1ec84c0
