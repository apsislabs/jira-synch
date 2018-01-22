#!/bin/bash

# Work in root directory
cd "$(dirname ${BASH_SOURCE[0]})/.."

# Install symlinks
rm -rf .git/hooks
ln -s -f .githooks/ .git/hooks

# Set up secrets
mkdir -p secrets
touch secrets/apsis_password.txt
touch secrets/natera_password.txt

# Install correct version of node, then install node modules
nvm install $(cat .nvmrc)
npm install

# Run initial build and test
npm run build
npm run test
