## Development Guide

### Requirements

1. NVM (https://github.com/creationix/nvm#installation)

### Getting Started

1. Clone the repository
2. Run `bin/init.sh`
3. Enter your jira credentials in the `secrets` folder
4. Rejoice!

### Useful commands

- `npm run watch`: watch and compile the application in the background
- `npm run build`: like watch, but just a one-time build
- `npm test`: lint and test your changes
- `npm start`: run the application

See the `scripts` section of `package.json` for a full list of commands.

### Development Process ###

Use [GitHub Flow](https://guides.github.com/introduction/flow/) and [write good commit messages](https://chris.beams.io/posts/git-commit/).

### Visual Studio Code ###

**TODO**: Document optional integration with VS Code (e.g. running and debugging through the IDE).

### Jira API Documentation ###

- https://docs.atlassian.com/software/jira/docs/api/REST/7.1.9/
- https://docs.atlassian.com/jira-software/REST/7.1.9/

### Managing Multiple Versions of Node.js

This project uses async functions and other features that are only supported in recent versions of node.  NVM will allow you to install multiple versions of node side-by-side and switch between them (like RVM does for ruby) in case you need an older version installed for other projects.

But unlike RVM, _nvm does not automatically switch node versions_ when you enter a project directory.  If you are using different versions of node elsewhere, you must remember to run `nvm use` in the root directory (it will pick up the required version from the .nvmrc file) before running this app.

Or if you prefer, see https://github.com/creationix/nvm#deeper-shell-integration for examples of how to set up automatic version switching for NVM.
