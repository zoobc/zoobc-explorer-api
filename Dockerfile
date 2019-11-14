FROM ubuntu:18.04
MAINTAINER Docker
RUN mkdir -p /usr/src/app && chown -R root:root /usr/src/app
USER root
RUN mkdir -p /data/db

RUN apt-get update && apt-get install -y gnupg
RUN apt-get -y install redis-server

#==========MONGO DB============================================================================================================================
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
RUN echo 'deb http://repo.mongodb.org/apt/ubuntu $(cat /etc/lsb-release | grep DISTRIB_CODENAME | cut -d= -f2)/mongodb-org/3.2'
RUN apt-get install -y mongodb
RUN mkdir -p /data/db
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
EXPOSE 27017

RUN mkdir ~/log
CMD mongod --fork --logpath ~/log/mongodb.log && redis-server --daemonize yes && node /usr/src/app/app.js
