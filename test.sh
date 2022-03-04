#!/bin/bash
set -euo pipefail

yarn install
yarn prod
yarn coverage
yarn lint

curl -Os https://uploader.codecov.io/latest/linux/codecov
chmod +x codecov
./codecov -t ${CODECOV_TOKEN} --dir ./coverage