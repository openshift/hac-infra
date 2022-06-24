#!/bin/bash
set -euo pipefail

npm install
npm run verify

curl -Os https://uploader.codecov.io/latest/linux/codecov
chmod +x codecov
./codecov -t ${CODECOV_TOKEN} --dir ./coverage