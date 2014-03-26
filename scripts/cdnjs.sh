#!/bin/bash

# Update CDNJS with the latest version of Doony. Assumes you have a cdnjs
# folder at the same level as the doony folder.

set -ev

if [ $# -lt 1 ]; then
    echo "Please supply a tag number"
    exit 1;
fi

VERSION="$1"

git pull origin master

pushd ../cdnjs/ajax/libs/doony
    git clean -f
    git checkout -b "doony-$VERSION" master
    mkdir -p "$VERSION"
    pushd "$VERSION"
        mkdir -p css js
    popd

    # This probably only works with BSD sed.
    sed -i.bak -E "s/\"version\": \"[[:digit:]]+\.[[:digit:]]+\"/\"version\": \"$VERSION\"/" package.json
popd

cp doony.min.css "../cdnjs/ajax/libs/doony/$VERSION/css"
cp doony.min.js "../cdnjs/ajax/libs/doony/$VERSION/js"

pushd ../cdnjs
    git add "ajax/libs/doony/$VERSION"
    git add "ajax/libs/doony/package.json"
    git commit -m "Added Doony version $VERSION"
    git push origin "doony-$VERSION"
popd

echo "Committed and pushed to remote origin."
