#!/bin/bash

# Build script for Cultural AI Navigator mobile app demo
# This script helps build the mobile app for demonstration purposes

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Cultural AI Navigator - Mobile App Demo Build ===${NC}"
echo

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed. Please install Node.js and npm.${NC}"
    exit 1
fi

# Check if expo-cli is installed
if ! command -v expo &> /dev/null; then
    echo -e "${YELLOW}Warning: expo-cli is not installed. Installing it now...${NC}"
    npm install -g expo-cli
fi

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm install

# Build type selection
echo
echo -e "${GREEN}Select build type:${NC}"
echo "1) Android APK (requires Expo account)"
echo "2) iOS Simulator Build (requires macOS and Xcode)"
echo "3) Web Build (easiest for quick demo)"
echo "4) Expo Go QR Code (for testing on physical devices)"
read -p "Enter your choice (1-4): " BUILD_TYPE

case $BUILD_TYPE in
    1)
        echo -e "${GREEN}Building Android APK...${NC}"
        echo -e "${YELLOW}Note: This requires an Expo account and may take some time.${NC}"
        expo build:android -t apk
        ;;
    2)
        echo -e "${GREEN}Building for iOS Simulator...${NC}"
        echo -e "${YELLOW}Note: This requires macOS and Xcode.${NC}"
        expo build:ios -t simulator
        ;;
    3)
        echo -e "${GREEN}Building for Web...${NC}"
        expo build:web
        echo -e "${GREEN}Build completed. Output is in the web-build folder.${NC}"
        echo -e "${YELLOW}To serve the web build locally:${NC}"
        echo "npx serve web-build"
        ;;
    4)
        echo -e "${GREEN}Starting Expo development server...${NC}"
        echo -e "${YELLOW}Scan the QR code with the Expo Go app on your device.${NC}"
        expo start
        ;;
    *)
        echo -e "${RED}Invalid option. Exiting.${NC}"
        exit 1
        ;;
esac

echo
echo -e "${GREEN}Done!${NC}" 