#!/bin/bash

# Setup script for testing environment

# Exit on error
set -e

# Install dependencies
npm install

echo "Installing iOS dependencies..."
cd ios
pod install
cd ..

echo "Setup complete! You can now run tests with:"
echo "  npm test                  - Run unit tests" 