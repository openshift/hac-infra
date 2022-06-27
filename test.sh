#!/bin/bash
set -euo pipefail
set +x

yarn install
yarn prod
yarn coverage
yarn lint

# Upload code coverage
./prow-codecov.sh 2>/dev/null
