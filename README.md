# Cultural AI

A platform that leverages AI to provide cultural insights and recommendations.

## Overview

Cultural AI is a React Native application with a Node.js/Express backend that connects users with culturally relevant content and recommendations. The application uses AI to analyze and understand cultural contexts, providing personalized experiences.

## Features

- Cultural content recommendations
- AI-powered cultural insights
- User authentication and personalization
- SQL Server database integration

## Tech Stack

### Frontend
- React Native
- TypeScript
- StyleSheet for styling

### Backend
- Node.js
- Express
- SQL Server (MSSQL)
- OpenAI integration

### DevOps
- Docker support
- GitHub Actions for CI/CD

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- SQL Server instance
- Environment variables configured

### Installation

1. Clone the repository:
```
git clone https://github.com/emmanuellawal/culturalai.git
cd culturalai
```

2. Install dependencies:
```
npm install
cd server
npm install
```

3. Set up the database:
```
npm run db:setup
```

4. Start the server:
```
cd server
npm run dev
```

5. Start the client application:
```
npm start
```

## Environment Variables

Create a `database.env` file with the following variables:
- DB_USER
- DB_PASSWORD
- DB_SERVER
- DB_DATABASE
- API_KEY (for OpenAI integration)

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Contact

For questions or support, please open an issue on the GitHub repository.