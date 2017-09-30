# Makefile for a standard repo with associated container

##### These variables need to be adjusted in most repositories #####

ELECTRON_VERSION := 1.7.6
ELECTRON_PACKAGER_VERSION := 9.1.0
DDEV_UI_VERSION := $(VERSION)

COMPANY_NAME := Drudtech
PRODUCT_NAME := ddevui

# This repo's root import path (under GOPATH).
PKG := github.com/drud/ddev-ui

# Docker repo for a push
# DOCKER_REPO ?= drud/docker_repo_name

# Upstream repo used in the Dockerfile
# UPSTREAM_REPO ?= full/upstream-docker-repo

# Top-level directories to build
SRC_DIRS :=

# Version variables to replace in build, The variable VERSION is automatically pulled from git committish so it doesn't have to be added
# These are replaced in the $(PKG).version package.
# VERSION_VARIABLES = ThisCmdVersion ThatContainerVersion

# These variables will be used as the defaults unless overridden by the make command line
#ThisCmdVersion ?= $(VERSION)
#ThatContainerVersion ?= drud/nginx-php-fpm7-local

# Optional to docker build
# DOCKER_ARGS =

# VERSION can be set by
  # Default: git tag
  # make command line: make VERSION=0.9.0
# It can also be explicitly set in the Makefile as commented out below.

# This version-strategy uses git tags to set the version string
# VERSION can be overridden on make commandline: make VERSION=0.9.1 push
VERSION := $(shell git describe --tags --always --dirty)
#
# This version-strategy uses a manual value to set the version string
#VERSION := 1.2.3

# Each section of the Makefile is included from standard components below.
# If you need to override one, import its contents below and comment out the
# include. That way the base components can easily be updated as our general needs
# change.
#include build-tools/makefile_components/base_build_go.mak
include build-tools/makefile_components/base_build_python-docker.mak
#include build-tools/makefile_components/base_container.mak
#include build-tools/makefile_components/base_push.mak
#include build-tools/makefile_components/base_test_go.mak
include build-tools/makefile_components/base_test_python.mak


# Additional targets can be added here
# Also, existing targets can be overridden by copying and customizing them.

.PHONY: build clean

all: darwin linux windows

# Build requirements
# - wine and mono must be available to build Windows on another platform (brew install wine mono )

linux darwin: npminstall
	@echo "Building $@"
	PATH=$$PATH:./node_modules/.bin electron-packager . --overwrite --platform=$@ --arch=x64 --icon=build/icon.icns --prune=true --out=release-builds --electronVersion=$(ELECTRON_VERSION)

windows: npminstall
	@echo "Building $@"
	PATH=$$PATH:./node_modules/.bin electron-packager . --overwrite --asar=true --platform=win32 --arch=ia32 --icon=build/icon.ico --prune=true --out=release-builds --version-string.CompanyName=$(COMPANY_NAME) --version-string.FileDescription=$(PRODUCT_NAME) --version-string.ProductName='$(PRODUCT_NAME)' --electronVersion=$(ELECTRON_VERSION)


npminstall: package.json
	npm install
	npm install electron-packager@$(ELECTRON_PACKAGER_VERSION)

# Preprocess package.json.in into package.json so we can replace key variables like versions.
package.json: package.json.in
	awk '{ gsub( /\$$DDEV_UI_VERSION/, "$(VERSION)"); gsub( /\$$ELECTRON_VERSION/, "$(ELECTRON_VERSION)"); gsub( /\$$ELECTRON_PACKAGER_VERSION/, "$(ELECTRON_PACKAGER_VERSION)"); print } ' <package.json.in > package.json

clean:
	rm -rf package.json release-builds node_modules
