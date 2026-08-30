#!/usr/bin/env bash
set -e

# Config
BUILD_DIR="dist"
DEPLOY_BRANCH="deploy"

# Build the project
npm run build

# Go into build dir
cd "$BUILD_DIR"

# Init a fresh git repo in the build output
rm .DS_Store
touch .nojekyll
git init -q
git config user.name "Kamran Ansari"
git config user.email "ranmerc@outlook.com"
git checkout -b "$DEPLOY_BRANCH"
git add -A
git commit -q -m "Deploy: $(date -u +'%Y-%m-%d %H:%M:%S UTC')"

# Force push to the deploy branch on your existing remote
git push --force "$(git -C .. remote get-url origin)" "$DEPLOY_BRANCH:$DEPLOY_BRANCH"

# Clean up the temp .git folder so it doesn't linger in dist/
rm -rf .git

cd ..
echo "Deployed to '$DEPLOY_BRANCH' branch."