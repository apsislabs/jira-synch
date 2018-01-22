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
touch secrets/jira.txt

read -p "Enter Your Apsis Email: `echo $'\n> '`" username_apsis
read -s -p "Enter Apsis Jira Password: `echo $'\n> '`" pwd_apsis
echo $'\n'
read -p "Enter Your Natera Username: `echo $'\n> '`" username_natera
read -s -p "Enter Natera Jira Password: `echo $'\n> '`" pwd_natera

echo $username_apsis >> secrets/jira.txt
echo $pwd_apsis >> secrets/jira.txt
echo $username_natera >> secrets/jira.txt
echo $pwd_natera >> secrets/jira.txt

# Install correct version of node, then install node modules
nvm install $(cat .nvmrc)
npm install

# Run initial build and test
npm run build
npm run test
