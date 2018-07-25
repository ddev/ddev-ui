# ddev-ui

A Graphical User Interface for the DDEV CLI (https://github.com/drud/ddev)

## Prerequisites

If you are looking to contribute to the project you will need to make sure you have the below prerequisites.

#### DDEV CLI

DDEV CLI is installed and properly working.

#### Yarn

Yarn is installed globally `npm install -g yarn`.

#### Node

Node -lts (v8.11.3) is installed and configured in your path.

NVM - Node version manager https://github.com/creationix/nvm

To install NVM

```sh
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

<sub>The script clones the nvm repository to `~/.nvm` and adds the source line to your profile (`~/.bash_profile`, `~/.zshrc`, `~/.profile`, or `~/.bashrc`).</sub>

```sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

To Install Node -lts

```sh
nvm install --lts
nvm use lts/*
nvm alias default lts/*
```

To Verify

```sh
node -v
npm -v
```

<sub>Should be **node** = `v8.11.x` and **npm** = `5.6.x`</sub>

## Run Instructions

- Ensure DDEV is installed and properly working via CLI and you have valid projects installed.
  - `make clean package` - To test with packaged app.
  - `make clean appstart` - To test with DevTools and HMR.

## Build Instructions

DDEV UI has been tested on macOS, Win7/8/10, Ubuntu 16.04+ and Fedora 25+. The following commands will output the compiled binary to /release-builds .

- macOS: `make clean darwin`
- windows: `make clean windows`
- linux: `make clean linux`

While developing and testing casually locally (not for formal reviews), you may wish to skip building the full binary by running `make clean appstart` or using yarn `yarn install && yarn start` in the main ddev-ui directory.

This will launch the ddev-ui electron app without requiring building disk images and closing/reopening the binary.

## Initial Roadmap

The planned roadmap can be found at
https://github.com/drud/ddev-ui/wiki/Roadmap.

DDEV-UI is currently at V0.3.0
