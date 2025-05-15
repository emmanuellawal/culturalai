# Cultural Nuance Navigator

A mobile application that helps users navigate cultural nuances and etiquette across different cultures and contexts.

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: React Context API
- **Navigation**: React Navigation
- **Storage**: 
  - Local: AsyncStorage for user preferences
  - Database: SQLite for cultural data
- **Location Services**: Expo Location
- **Code Quality**:
  - ESLint for linting
  - Prettier for code formatting
  - TypeScript for type safety

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── navigation/     # Navigation configuration
├── services/      # API and business logic
├── utils/         # Helper functions and constants
└── assets/        # Images, fonts, and other static files
    ├── legal/     # Legal documents (privacy policy, terms)
    └── images/    # Image assets
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on iOS/Android:
   ```bash
   npm run ios
   # or
   npm run android
   ```

## Development Guidelines

- Use TypeScript for all new files
- Follow ESLint and Prettier configurations
- Components should be functional components with hooks
- Use React Navigation for all navigation
- Store user preferences in AsyncStorage
- Use SQLite for storing cultural data
- Follow the established folder structure
- Write meaningful commit messages

## License

[License details to be added] 