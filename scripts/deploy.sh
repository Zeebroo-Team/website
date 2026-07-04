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

# Fix .git/objects ownership if a previous run wrote files as root.
echo "==> Fixing .git permissions..."
sudo chown -R "$(whoami)" "${REPO_DIR}/.git" 2>/dev/null || true
sudo chmod -R u+rw "${REPO_DIR}/.git/objects" 2>/dev/null || true

# Normalize remote URL: replace SSH config aliases with the real github.com hostname.
# This fixes deployments where the repo was originally cloned using a local SSH
# config alias (e.g. git@github-website:...) that does not exist on the server.
CURRENT_REMOTE="$(git remote get-url origin 2>/dev/null || true)"
if [[ -n "${CURRENT_REMOTE}" && "${CURRENT_REMOTE}" != *"github.com"* ]]; then
  REPO_PATH="$(echo "${CURRENT_REMOTE}" | sed 's/.*:\(.*\)/\1/')"
  git remote set-url origin "git@github.com:${REPO_PATH}"
  echo "==> Fixed remote URL: git@github.com:${REPO_PATH}"
fi

echo "==> Pulling latest ${GIT_BRANCH}..."
git fetch origin "${GIT_BRANCH}"
git reset --hard "origin/${GIT_BRANCH}"

echo "==> Restarting ${SERVICE_NAME}..."
sudo systemctl restart "${SERVICE_NAME}"

echo "==> Checking service status..."
sudo systemctl is-active --quiet "${SERVICE_NAME}"

echo "Deploy complete: ${DEPLOY_PATH} @ $(git rev-parse --short HEAD)"
