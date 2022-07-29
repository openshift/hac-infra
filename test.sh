#!/bin/bash
set -euo pipefail


JOB_TYPE=${JOB_TYPE:-"local"}
# --legacy-peer-deps is needed as a temporary workaround (see HAC-1814)
npm install --legacy-peer-deps
npm run verify

if [[ "${JOB_TYPE}" != "local" ]]; then
    curl -Os https://uploader.codecov.io/latest/linux/codecov
    chmod +x codecov
    ./codecov -t "${CODECOV_TOKEN}" --dir ./coverage
fi
