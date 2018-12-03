# ddev-ui

A Graphical User Interface for the DDEV CLI (https://github.com/drud/ddev)

[![CircleCI](https://circleci.com/gh/drud/ddev-ui.svg?style=shield)](https://circleci.com/gh/drud/ddev-ui) ![project is maintained](https://img.shields.io/maintenance/yes/2018.svg)

## Prerequisites

If you are looking to contribute to the project you will need to make sure you have the below prerequisites.

### DDEV CLI

[DDEV CLI](https://github.com/drud/ddev/blob/master/CONTRIBUTING.md) is installed and properly working.

### Node

```sh
node -v
```

- Node-lts/dubnium (v10.11+) is installed and configured in your path.

#### Install with Homebrew

```sh
brew install node
```

#### Install with NVM if you want muliptle versions of node. - https://github.com/creationix/nvm

To install NVM

```sh
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

<sub>The script clones the nvm repository to `~/.nvm` and adds the source line to your profile (`~/.bash_profile`, `~/.zshrc`, `~/.profile`, or `~/.bashrc`).</sub>

```sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

To Install Node stable

```sh
nvm install stable
nvm use stable
nvm alias default stable
```

To Verify

```sh
node -v
npm -v
```

<sub>Should be **node** >= `v10.x` and **npm** = `6.x`</sub>

### Yarn

#### Install with NPM

- To install Yarn globally `npm install -g yarn`.

#### Install with Homebrew

- [Setup Homebrew](https://ddev.readthedocs.io/en/latest/)
- To install Yarn globally `brew install yarn --without-node`.

## Run Instructions

- Ensure DDEV is installed and properly working via CLI and you have valid projects installed.
  - `make clean` - To test with packaged app.
  - `make clean appstart` - To test with DevTools and HMR.

## Build Instructions

DDEV UI has been tested on macOS, Win7/8/10, Ubuntu 16.04+ and Fedora 25+. The following commands will output the compiled binary to /release-builds .

- macOS: `make clean darwin`
- windows: `make clean windows`
- linux: `make clean linux`

While developing and testing casually locally (not for formal reviews), you may wish to skip building the full binary by running `make clean appstart` or using yarn `yarn install && yarn start` in the main ddev-ui directory.

This will launch the ddev-ui electron app without requiring building disk images and closing/reopening the binary.

## Build Release Instructions

DDEV UI has been tested on macOS, Win7/8/10, Ubuntu 16.04+ and Fedora 25+. The following commands will output the compiled binary to /release-builds .

- All: `make clean release`
- macOS: `make release-darwin`
- windows: `make clean release-windows`
- linux: `make clean release-linux`

## Alpha Release

- This is an initial alpha release. We fully expect there to be bugs and we have a backlog of features we are working on. We'll respond as quickly as we can to new requests.
- We would love your suggestions, contributions, and help! Please review our [Guidelines for Contributing](https://github.com/drud/ddev/blob/master/CONTRIBUTING.md).

## Known Issues

- This version only supports Mac OS. We are working on getting Linux and Windows support and testing in by the next release.
- While existing TYPO3, Drupal 6, and Backdrop sites will work, the Create New Project functionality currently only works from Drupal 7, Drupal 8, and WordPress. We are working hard on adding support for Typo3, Drupal 6, and Backdrop in the next release.
- We are still working on the code signature so you’ll need to right-click to bypass Mac security settings when opening the app the first time.

## Initial Roadmap

The planned roadmap can be found at
https://github.com/drud/ddev-ui/wiki/Roadmap.

DDEV-UI is currently at v0.6.0-alpha

As always, thank for your support, feedback, and contributions!
