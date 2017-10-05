#!/bin/bash

set -o errexit
set -x

ARTIFACTS=$1

sudo mkdir $ARTIFACTS && sudo chmod 777 $ARTIFACTS

cd dist
cp ddev-ui* $ARTIFACTS

# Create the sha256 files
cd $ARTIFACTS
for item in ddev-ui*; do
  shasum -a 256 "$item" > "$item.sha256.txt"
done

