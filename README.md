# ddev-ui
A Graphical User Interface to compliment the DDEV CLI (https://github.com/drud/ddev)

## Prerequisites
* DDEV CLI is installed and properly working.
* Node.js is installed and NPM is working (http://www.nodejs.org)

## Run Instructions
* Ensure DDEV is installed and properly working via CLI and you have valid projects installed.
* Before first run, install Node dependencies by running `npm install`
* Launch the GUI by running `npm run start`

## Build Instructions
DDEV UI has been tested on OS X, Win7/8/10, Ubuntu 16.04+ and Fedora 25+. The following commands will output the compiled binary to /release-builds .
* OS X: `npm run build-osx`
* Linux: `npm run build-linux`
* Windows: `npm run build-win`

## Initial Roadmap
The planned roadmap can be found at 
https://github.com/drud/ddev-ui/wiki/Roadmap.

DDEV-UI is currently at V0.2, with the exception of "Add an app from a starting distribution" from release v0.1 and "Add an app from a local repo" from release v0.2 being non-functional.