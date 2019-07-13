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
# 1. delete and clone repo zoobc-schema
SECONDS=0
if [ -d "./zoobc-schema" ]; then
  rm -rf zoobc-schema
fi
git clone git@github.com:zoobc/zoobc-schema.git

# 2. finish
duration=$SECONDS
echo -e "\n$(echo_done) Done in $(($duration % 60)) seconds."
