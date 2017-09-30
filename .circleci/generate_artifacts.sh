#!/bin/bash

set -o errexit
set -x

ARTIFACTS=$1
BASE_DIR=$PWD

sudo mkdir $ARTIFACTS && sudo chmod 777 $ARTIFACTS
export VERSION=$(git describe --tags --always --dirty)

for item in release-builds/DDEV*; do
	pushd $item
	filebase=$(basename $item)
	pwd && ls -a
	tar -czf $ARTIFACTS/${filebase}.tar.gz .
	zip $ARTIFACTS/${filebase}.zip *
	popd
done

# Create the sha256 files
cd $ARTIFACTS
for item in *.tar.gz *.zip; do
  sha256sum $item > $item.sha256.txt
done
