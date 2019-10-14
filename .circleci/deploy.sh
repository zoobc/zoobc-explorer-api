#!/bin/bash
rm -rf .git
rm -rf .gitignore
git config --global user.email "igedetirtanata@gmail.com"
git config --global user.name "gedenata"

pm2 stop zoobcexplorer:6969
git pull origin develop
rm -rf node_modules/ yarn.lock && yarn
pm2 start zoobcexplorer:6969
