#!/bin/bash

# Update CDNJS with the latest version of Doony. Assumes you have a cdnjs
# folder at the same level as the doony folder.

set -eufv -o pipefail

if [ $# -lt 1 ]; then
    echo "Please supply a tag number"
    exit 1;
fi

VERSION="$1"
CDNJS_DIR='cdnjs'

git pull origin master

pushd "../$CDNJS_DIR/ajax/libs/doony"
    git clean -f
    git checkout master
    # Assumes you have the cdnjs repo as your upstream remote, and your
    # personal repo as the "origin" remote.
    git pull upstream master
    git checkout -b "doony-$VERSION" master
    mkdir -p "$VERSION"
    pushd "$VERSION"
        mkdir -p css js
    popd

    # This probably only works with BSD sed.
    sed -i.bak -E "s/\"version\": \"[[:digit:]]+\.[[:digit:]]+\"/\"version\": \"$VERSION\"/" package.json
popd

cp doony.min.css "../$CDNJS_DIR/ajax/libs/doony/$VERSION/css"
cp doony.min.js "../$CDNJS_DIR/ajax/libs/doony/$VERSION/js"
cp doony.js.map "../$CDNJS_DIR/ajax/libs/doony/$VERSION/js"

pushd "../$CDNJS_DIR"
    git add "ajax/libs/doony/$VERSION"
    git add "ajax/libs/doony/package.json"
    git commit -m "Added Doony version $VERSION"
    git push origin "doony-$VERSION"
popd

echo "Committed and pushed to remote origin."
open "https://github.com/kevinburke/cdnjs/compare/doony-$VERSION?expand=1"
