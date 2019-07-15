#!/bin/bash

# Generate build output for deploy environment
echo Starting Build

# npm install
tsc

# copy package.json to dist
cp package.json ./MegAlexa
cp package-lock.json ./MegAlexa


echo Build Finished