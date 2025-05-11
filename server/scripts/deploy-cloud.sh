#!/bin/bash

# Cloud Deployment Script for Cultural AI Navigator Backend

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Cultural AI Navigator - Cloud Deployment Script ===${NC}"
echo

# Default values
CLOUD_PROVIDER="azure"
ENVIRONMENT="production"
SERVER_DIR="."

# Process command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -p|--provider) CLOUD_PROVIDER="$2"; shift ;;
        -e|--environment) ENVIRONMENT="$2"; shift ;;
        -d|--directory) SERVER_DIR="$2"; shift ;;
        -h|--help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  -p, --provider PROVIDER    Cloud provider (azure, aws, heroku) (default: azure)"
            echo "  -e, --environment ENV      Deployment environment (production, staging) (default: production)"
            echo "  -d, --directory DIR        Path to server directory (default: .)"
            echo "  -h, --help                 Show this help message"
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

# Navigate to server directory
cd "$SERVER_DIR"

echo -e "${GREEN}Deploying to $CLOUD_PROVIDER ($ENVIRONMENT)...${NC}"

# Deploy based on cloud provider
case $CLOUD_PROVIDER in
    azure)
        echo -e "${GREEN}Deploying to Azure App Service...${NC}"
        
        # Check if Azure CLI is installed
        if ! command -v az &> /dev/null; then
            echo -e "${RED}Error: Azure CLI not found. Please install Azure CLI first.${NC}"
            echo -e "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
            exit 1
        fi
        
        # Check if user is logged in
        az account show &> /dev/null
        if [ $? -ne 0 ]; then
            echo -e "${YELLOW}You need to log in to Azure first.${NC}"
            az login
        fi
        
        # Create a deployment package
        echo -e "${GREEN}Creating deployment package...${NC}"
        zip -r ../server-deployment.zip . -x "node_modules/*" "*.git*"

        echo -e "${YELLOW}Now you need to upload the deployment package to Azure.${NC}"
        echo -e "You can use the following command (replace with your resource group and app name):"
        echo -e "az webapp deploy --resource-group <resource-group> --name <app-name> --src-path ../server-deployment.zip"
        echo
        echo -e "${YELLOW}Remember to configure environment variables in the Azure Portal.${NC}"
        echo -e "See server/docs/cloud-deployment.md for details on required environment variables."
        ;;
        
    aws)
        echo -e "${GREEN}Deploying to AWS Elastic Beanstalk...${NC}"
        
        # Check if EB CLI is installed
        if ! command -v eb &> /dev/null; then
            echo -e "${RED}Error: Elastic Beanstalk CLI not found. Please install EB CLI first.${NC}"
            echo -e "Run: pip install awsebcli"
            exit 1
        fi
        
        # Initialize EB if needed
        if [ ! -f .elasticbeanstalk/config.yml ]; then
            echo -e "${YELLOW}Elastic Beanstalk environment not initialized. Initializing now...${NC}"
            eb init
        fi
        
        # Deploy to EB
        echo -e "${GREEN}Deploying to Elastic Beanstalk...${NC}"
        eb deploy
        
        echo -e "${YELLOW}Remember to configure environment variables in the EB Console.${NC}"
        echo -e "See server/docs/cloud-deployment.md for details on required environment variables."
        ;;
        
    heroku)
        echo -e "${GREEN}Deploying to Heroku...${NC}"
        
        # Check if Heroku CLI is installed
        if ! command -v heroku &> /dev/null; then
            echo -e "${RED}Error: Heroku CLI not found. Please install Heroku CLI first.${NC}"
            echo -e "Visit: https://devcenter.heroku.com/articles/heroku-cli"
            exit 1
        fi
        
        # Check if user is logged in
        heroku auth:whoami &> /dev/null
        if [ $? -ne 0 ]; then
            echo -e "${YELLOW}You need to log in to Heroku first.${NC}"
            heroku login
        fi
        
        # Check if git is initialized
        if [ ! -d .git ]; then
            echo -e "${YELLOW}Git repository not initialized. Initializing now...${NC}"
            git init
            git add .
            git commit -m "Initial commit for Heroku deployment"
        fi
        
        # Check if Heroku app exists
        if ! heroku apps:info &> /dev/null; then
            echo -e "${YELLOW}Heroku app not found. Creating a new app...${NC}"
            heroku create
        fi
        
        # Deploy to Heroku
        echo -e "${GREEN}Deploying to Heroku...${NC}"
        git push heroku main
        
        echo -e "${YELLOW}Remember to configure environment variables in Heroku.${NC}"
        echo -e "See server/docs/cloud-deployment.md for details on required environment variables."
        ;;
        
    docker)
        echo -e "${GREEN}Building Docker image...${NC}"
        
        # Check if Docker is installed
        if ! command -v docker &> /dev/null; then
            echo -e "${RED}Error: Docker not found. Please install Docker first.${NC}"
            exit 1
        fi
        
        # Build Docker image
        docker build -t culturalai-server .
        
        echo -e "${GREEN}Docker image built successfully.${NC}"
        echo -e "${YELLOW}You can run the container with:${NC}"
        echo -e "docker run -p 3000:3000 -p 3443:3443 --env-file .env culturalai-server"
        ;;
        
    *)
        echo -e "${RED}Error: Unsupported cloud provider: $CLOUD_PROVIDER${NC}"
        echo "Supported providers: azure, aws, heroku, docker"
        exit 1
        ;;
esac

echo
echo -e "${GREEN}Deployment script completed.${NC}" 