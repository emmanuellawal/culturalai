# Cultural AI Navigator - Build & Deployment Scripts

This directory contains scripts for building and deploying the Cultural AI Navigator application.

## Scripts Overview

### `build-mobile-demo.sh`

This script helps you build the mobile application for demonstration purposes.

**Usage:**
```bash
./build-mobile-demo.sh
```

The script will guide you through different build options:
1. Android APK (requires Expo account)
2. iOS Simulator Build (requires macOS and Xcode)
3. Web Build (easiest for quick demo)
4. Expo Go QR Code (for testing on physical devices)

### `deploy-server.sh`

This script helps you deploy the server to different cloud environments.

**Usage:**
```bash
./deploy-server.sh [options]
```

**Options:**
- `-e, --environment ENV`: Deployment environment (development, staging, production)
- `-d, --directory DIR`: Path to server directory (default: ./server)
- `-h, --help`: Show help message

**Examples:**
```bash
# Start the server in development mode
./deploy-server.sh -e development

# Deploy to staging environment
./deploy-server.sh -e staging

# Deploy to production environment
./deploy-server.sh -e production

# Specify a different server directory
./deploy-server.sh -e production -d ./path/to/server
```

## CI/CD Integration

These scripts are designed to work with the GitHub Actions workflows in `.github/workflows/`:

- `client-ci.yml`: Handles client-side CI/CD
- `server-ci.yml`: Handles server-side CI/CD

The GitHub Actions workflows will automatically run tests and create deployment artifacts for manual deployment.

## Testing

For the server, we've set up a basic test framework using Mocha. To run the tests:

```bash
cd server
npm test
```

To run tests in watch mode:

```bash
cd server
npm run test:watch
``` 