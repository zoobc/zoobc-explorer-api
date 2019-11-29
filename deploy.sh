#!/bin/bash

# pm2 stop zoobcexplorer:6969
# git pull origin develop
# rm -rf node_modules/ yarn.lock && yarn
# pm2 start zoobcexplorer:6969

pm2 deploy ecosystem.config.js testnet update
