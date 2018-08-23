#!/bin/bash

set -o errexit
set -x

ARTIFACTS=$1

sudo mkdir $ARTIFACTS && sudo chmod 777 $ARTIFACTS

cd dist
cp DDEV\ UI* $ARTIFACTS

# Create the sha256 files
cd $ARTIFACTS
for item in DDEV\ UI*; do
  shasum -a 256 "$item" > "$item.sha256.txt"
done

