#!/bin/bash

# Setup script for testing environment

# Exit on error
set -e

# Install dependencies
npm install

# Install detox CLI
npm install -g detox-cli

echo "Installing iOS dependencies..."
cd ios
pod install
cd ..

echo "Setup complete! You can now run tests with:"
echo "  npm test                  - Run unit tests"
echo "  npm run test:e2e:legacy   - Run E2E tests on legacy architecture"
echo "  npm run test:e2e:new      - Run E2E tests on new architecture" 