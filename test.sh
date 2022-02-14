#!/bin/bash
set -euo pipefail

yarn install
yarn prod
yarn test
yarn lint
