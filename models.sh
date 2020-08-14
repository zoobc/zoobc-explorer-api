#!/bin/bash

# ###### FUNCTIONS ######
function echo_pass() {
  printf "\e[32m✔ ${1}"
  printf "\033\e[0m"
}

function echo_done() {
  printf "\e[32m✨  ${1}"
  printf "\033\e[0m"
}

# ###### EXECUTES ######
# 1. delete and clone repo zoobc-explorer-scheduler
SECONDS=0
if [ -d "./zoobc-explorer-scheduler" ]; then
  rm -rf zoobc-explorer-scheduler
fi
git clone -b develop git@github.com:zoobc/zoobc-explorer-scheduler.git
# git clone -b experimental git@github.com:zoobc/zoobc-explorer-scheduler.git

# 2. copy repo zoobc-explorer-scheduler
if [ -d "./schema" ]; then
  rm -rf "./schema"
fi
if [ -d "./models" ]; then
  rm -rf "./models"
fi
mkdir -p "./models"
cp -R ./zoobc-explorer-scheduler/models ./

# 3. delete repo zoobc-explorer-scheduler
rm -rf zoobc-explorer-scheduler

# 4. finish
duration=$SECONDS
echo -e "\n$(echo_done) Done in $(($duration % 60)) seconds."
