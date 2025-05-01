# Sun Dressed

A mobile application that suggests what to wear based on weather conditions.

## Overview

Sun Dressed is designed to help users decide what to wear based on current and forecasted weather conditions. The app provides clothing recommendations tailored to the weather, making it easier to prepare for your day.

## Features

- **Real-time Weather Data**: Current weather conditions from OpenWeatherMap API
- **Clothing Recommendations**: Suggested outfits based on weather conditions
- **Location Management**: Set and save your preferred locations
- **User Authentication**: Secure account system with Supabase
- **Responsive Design**: UI adapts to different weather conditions
- **Offline Support**: Caching for when you're not connected

## How to Run the App

### Prerequisites

1. **Install Node.js and npm**:
   - Download and install Node.js from [https://nodejs.org/](https://nodejs.org/) (LTS version recommended)
   - This includes npm (Node Package Manager)

2. **Verify Installation**:
   ```
   node --version
   npm --version
   ```

### Setup and Installation

1. **Clone the Repository**:
   ```
   git clone <repository-url>
   cd sun-dressed
   ```

2. **Install Dependencies**:
   ```
   npm install --legacy-peer-deps
   ```
   The `--legacy-peer-deps` flag is required to resolve dependency conflicts.

3. **Create Environment Variables** (if needed):
   - Create a `.env` file in the root directory
   - Add your API keys and configuration (refer to .env.example if available)

### Running the App

#### Development Mode

1. **Start the Development Server**:
   ```
   npm start
   ```
   This will start the Expo development server.

2. **Run on Different Platforms**:
   - Web: `npm run web`
   - Android: `npm run android`
   - iOS: `npm run ios`

#### Using Expo Go App

1. Install the Expo Go app on your mobile device
2. Run `npm start` to start the development server
3. Scan the QR code with your device (Android) or the Camera app (iOS)

### Building for Production

1. **Web**:
   ```
   npm run build:web
   ```

2. **Native Apps**:
   ```
   expo build:android
   expo build:ios
   ```
   Note: iOS builds require an Apple Developer account.

## Development Guide

### Project Structure

The application follows a modular architecture:

- **src/components/**: UI components following atomic design principles
- **src/screens/**: Main application screens
- **src/services/**: API integration services
- **src/navigation/**: Navigation configuration
- **src/utils/**: Helper functions and utilities
- **src/assets/**: Static assets like images and fonts
- **src/__tests__/**: Test suites for components
- **src/__mocks__/**: Mock data for testing

See `STRUCTURE.md` for more detailed information about the project structure.

### Key Development Guidelines

1. **Follow the MVP First Approach**:
   - Complete all core features before moving to advanced features
   - Reference `specifications.md` for feature tracking
   - Mark tasks as completed with [x] in specifications.md

2. **Component Development**:
   - Use functional components with hooks
   - Follow atomic design pattern
   - Keep components under 150 lines
   - Provide TypeScript interfaces for all props

3. **Styling**:
   - Use React Native StyleSheet for styling
   - Define theme constants in a central location
   - Support both light and dark modes

4. **Testing**:
   - Add tests before marking features complete
   - Run tests with: `npm test`

### Git Workflow

- Main branch: stable releases only
- Develop branch: integration branch
- Feature branches: named feature/[feature-name]
- Test branches: named test/[feature-name]
- Commit message format: "[Feature/Fix/Refactor]: Brief description"

## Testing

Run tests with:

```
npm test
```

### Test Scenarios

1. **Weather Integration**:
   - Test with different locations
   - Verify weather data display
   - Check error handling and fallbacks

2. **Clothing Recommendations**:
   - Verify recommendations match weather conditions
   - Test different temperature ranges
   - Check for appropriate seasonal suggestions

3. **Authentication Flow**:
   - User registration
   - Login
   - Session persistence

## Troubleshooting

### Common Issues

1. **Dependency Errors**:
   - Run `npm install --legacy-peer-deps`
   - Check node_modules is in .gitignore

2. **API Issues**:
   - Verify your API keys are correct
   - Check rate limits on OpenWeatherMap API
   - Use mock data for development if needed

3. **Expo/React Native Issues**:
   - Clear cache: `expo r -c`
   - Update Expo CLI: `npm install -g expo-cli`
   - Check Expo status page for service disruptions

4. **TypeScript Errors**:
   - Run `npx tsc --noEmit` to find type issues
   - Install missing type definitions: `npm install --save-dev @types/package-name`

## Contribution Guidelines

1. Create a feature branch from develop
2. Implement your changes with appropriate tests
3. Submit a pull request with a clear description
4. Ensure all tests pass
5. Reference any related issues in your PR description

## License

© 2025 Joey Crawford. All Rights Reserved.
This code is proprietary and confidential. Unauthorized copying, transfer, or use is strictly prohibited.
