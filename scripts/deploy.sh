#!/usr/bin/env bash
# Run on the Ubuntu server (manually or via GitHub Actions SSH).
set -euo pipefail

DEPLOY_PATH="${DEPLOY_PATH:-/var/www/melting-app}"
SERVICE_NAME="${SERVICE_NAME:-melting-app}"
GIT_BRANCH="${GIT_BRANCH:-main}"

cd "${DEPLOY_PATH}"
REPO_DIR="$(pwd)"

if [[ ! -d .git ]]; then
  echo "ERROR: ${DEPLOY_PATH} is not a git repository. Clone the repo first."
  echo "  git clone git@github.com:Zeebroo-Team/website.git ${DEPLOY_PATH}"
  exit 1
fi

# Git 2.35+ refuses to run when the repo is owned by another user (e.g. www-data).
echo "==> Trusting repository directory for git..."
git config --global --add safe.directory "${REPO_DIR}"

echo "==> Pulling latest ${GIT_BRANCH}..."
git fetch origin "${GIT_BRANCH}"
git reset --hard "origin/${GIT_BRANCH}"

echo "==> Restarting ${SERVICE_NAME}..."
sudo systemctl restart "${SERVICE_NAME}"

echo "==> Checking service status..."
sudo systemctl is-active --quiet "${SERVICE_NAME}"

echo "Deploy complete: ${DEPLOY_PATH} @ $(git rev-parse --short HEAD)"
