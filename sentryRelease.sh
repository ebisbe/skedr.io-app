#!/bin/bash
VERSION=$(./node_modules/.bin/sentry-cli releases propose-version)

# Create a release
./node_modules/.bin/sentry-cli releases new -p frontend $VERSION

# Associate commits with the release
./node_modules/.bin/sentry-cli releases set-commits --auto $VERSION
