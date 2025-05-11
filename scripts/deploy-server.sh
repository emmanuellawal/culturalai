#!/bin/bash

# Server deployment script for Cultural AI Navigator
# This script helps deploy the server to different cloud environments

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Cultural AI Navigator - Server Deployment ===${NC}"
echo

# Default values
DEPLOY_ENV="development"
SERVER_DIR="./server"

# Process command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -e|--environment) DEPLOY_ENV="$2"; shift ;;
        -d|--directory) SERVER_DIR="$2"; shift ;;
        -h|--help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  -e, --environment ENV   Deployment environment (development, staging, production)"
            echo "  -d, --directory DIR     Path to server directory (default: ./server)"
            echo "  -h, --help              Show this help message"
            exit 0
            ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

# Check if server directory exists
if [ ! -d "$SERVER_DIR" ]; then
    echo -e "${RED}Error: Server directory '$SERVER_DIR' not found.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed. Please install Node.js and npm.${NC}"
    exit 1
fi

echo -e "${GREEN}Deploying server to $DEPLOY_ENV environment...${NC}"

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
cd "$SERVER_DIR"
npm ci

# Environment-specific deployment
case $DEPLOY_ENV in
    development)
        echo -e "${GREEN}Starting server in development mode...${NC}"
        npm run dev
        ;;
    staging|production)
        echo -e "${GREEN}Building for $DEPLOY_ENV...${NC}"
        
        # For Heroku deployment (example)
        if command -v heroku &> /dev/null; then
            echo -e "${YELLOW}Detected Heroku CLI. Deploying to Heroku...${NC}"
            echo -e "${YELLOW}Note: This assumes you've already set up a Heroku app and logged in.${NC}"
            
            git subtree push --prefix server heroku main
            
            echo -e "${GREEN}Deployed to Heroku.${NC}"
        # For AWS Elastic Beanstalk deployment (example)
        elif command -v eb &> /dev/null; then
            echo -e "${YELLOW}Detected AWS EB CLI. Deploying to Elastic Beanstalk...${NC}"
            echo -e "${YELLOW}Note: This assumes you've already set up EB CLI and initialized your application.${NC}"
            
            eb deploy
            
            echo -e "${GREEN}Deployed to AWS Elastic Beanstalk.${NC}"
        # Manual deployment instructions
        else
            echo -e "${YELLOW}No cloud deployment CLI detected. Manual deployment steps:${NC}"
            echo "1. Install the appropriate CLI for your cloud provider:"
            echo "   - For Heroku: npm install -g heroku"
            echo "   - For AWS: pip install awsebcli"
            echo "   - For Google Cloud: Install Google Cloud SDK"
            echo
            echo "2. Configure your cloud provider credentials"
            echo
            echo "3. Deploy using the provider-specific commands"
            echo "   - For Heroku: git subtree push --prefix server heroku main"
            echo "   - For AWS EB: eb deploy"
            echo "   - For GCP App Engine: gcloud app deploy"
        fi
        ;;
    *)
        echo -e "${RED}Invalid environment: $DEPLOY_ENV${NC}"
        echo "Valid environments: development, staging, production"
        exit 1
        ;;
esac

echo
echo -e "${GREEN}Done!${NC}" 