#!/bin/zsh

git add .

git commit -m "`date +"%Y-%m-%d %T"`"

git push origin main
