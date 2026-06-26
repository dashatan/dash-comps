#!/usr/bin/env bash
# Exit 0 = build, exit 1 = skip (Vercel ignored build step)
if ! git rev-parse --verify HEAD^ >/dev/null 2>&1; then
  exit 0
fi
git diff HEAD^ HEAD --quiet \
  apps/showcase \
  packages/ui \
  packages/core \
  packages/styles \
  packages/stubs \
  package.json \
  pnpm-lock.yaml \
  && exit 1 || exit 0
