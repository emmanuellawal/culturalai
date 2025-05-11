# Cloud Deployment Guide for Cultural AI Navigator Backend

This guide provides instructions for deploying the Cultural AI Navigator backend server to various cloud environments.

## Prerequisites

- Node.js 18 or higher
- SQL Server database (can be hosted in the cloud)
- A cloud provider account (Azure, AWS, Heroku, or similar)

## Environment Variables

The following environment variables need to be configured in your cloud environment:

### Server Configuration
- `PORT`: The HTTP port the server will listen on (default: 3000)
- `HTTPS_PORT`: The HTTPS port the server will listen on (default: 3443)
- `NODE_ENV`: Set to 'production' for production deployments

### Database Configuration
**Option 1: Connection string**
- `DB_CONNECTION_STRING`: Complete connection string to your SQL Server database

**Option 2: Individual connection parameters**
- `DB_SERVER`: Database server hostname
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name (default: CulturalAI)
- `DB_TRUST_SERVER_CERTIFICATE`: Set to 'true' if using a self-signed certificate

### JWT Configuration
- `JWT_SECRET`: A secure random string for JWT token generation
- `JWT_EXPIRATION`: Token expiration time (default: 24h)

### Security Configuration
- `ENABLE_HTTPS`: Set to 'true' to enable HTTPS (recommended for production)
- `GENERATE_SELF_SIGNED_CERTS`: Set to 'true' to generate self-signed certs (not recommended for production)

### Logging Configuration
- `LOG_LEVEL`: Log level (default: info)
- `ENABLE_REQUEST_LOGGING`: Set to 'true' to enable detailed request logging

### CORS Configuration
- `CORS_ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS

### AI Service Configuration
- `AI_SERVICE_API_KEY`: API key for the AI service
- `AI_SERVICE_ENDPOINT`: Endpoint URL for the AI service

## Database Setup

To set up the database schema in the cloud environment:

1. Ensure your database connection environment variables are configured
2. Run the database setup script:
   ```
   npm run db:setup
   ```

## Deployment Options

### Azure App Service

1. Create an App Service in Azure Portal
2. Configure environment variables in "Application settings"
3. Deploy using one of these methods:
   - GitHub Actions (recommended)
   - Azure CLI: `az webapp deploy --resource-group <resource-group> --name <app-name> --src-path server.zip`
   - Visual Studio Code Azure extension

### AWS Elastic Beanstalk

1. Create an Elastic Beanstalk environment
2. Configure environment variables in the EB Console
3. Deploy using one of these methods:
   - GitHub Actions (recommended)
   - EB CLI: `eb deploy`
   - AWS Console upload

### Heroku

1. Create a new Heroku app
2. Configure environment variables using:
   ```
   heroku config:set KEY=VALUE
   ```
3. Deploy using one of these methods:
   - GitHub integration
   - Heroku CLI: `git push heroku main`
   - GitHub Actions

### Docker Deployment

A Dockerfile is provided in the server directory. To build and run:

```bash
# Build the Docker image
docker build -t culturalai-server ./server

# Run the container
docker run -p 3000:3000 -p 3443:3443 --env-file ./server/.env culturalai-server
```

## Health Check

The server provides a health check endpoint at `/api/health` that can be used by load balancers or monitoring tools to verify the server is running correctly.

## Scaling Considerations

- The server is stateless and can be horizontally scaled
- For high availability, deploy multiple instances behind a load balancer
- Consider using a managed database service for the SQL Server database
- Implement a caching layer (like Redis) for frequently accessed data

## Monitoring

It's recommended to set up monitoring for the deployed application using:
- Azure Application Insights
- AWS CloudWatch
- Heroku Metrics
- Or another monitoring solution like New Relic or Datadog 