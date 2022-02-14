#!/bin/bash
set -euo pipefail

yarn prod
yarn test
yarn lint
