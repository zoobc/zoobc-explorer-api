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
