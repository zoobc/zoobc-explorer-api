#!/bin/bash

pm2 stop zoobcexplorer:6969
git pull origin testnet
rm -rf node_modules/ yarn.lock && yarn
pm2 start zoobcexplorer:6969
