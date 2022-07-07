#!/bin/bash
set -euo pipefail
set +x

npm install
npm run verify

# Upload code coverage
./prow-codecov.sh 2>/dev/null
