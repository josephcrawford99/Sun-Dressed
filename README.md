# Climate Closet

A mobile application that suggests what to wear based on the weather forecast.

## Overview

Climate Closet is designed to help users decide what to wear based on current and forecasted weather conditions. The app provides clothing recommendations for different times of the day (morning, afternoon, and evening) to ensure you're prepared for changing weather conditions.

## Features

- **Weather Information**: View current weather conditions and forecasts
- **Clothing Suggestions**: Receive personalized clothing recommendations based on weather conditions
- **Location Settings**: Set and save your location for accurate weather data
- **User Preferences**: Customize your experience with preference settings
- **Weather-Responsive UI**: Interface adapts to current weather conditions

## Mock Mode (Development)

The current version includes a special mock mode for testing and development:

- Simulated weather conditions (sunny, rainy, cloudy, snowy, night)
- Test weather selector to switch between different conditions
- Mock clothing suggestions based on weather data
- Adaptive UI that changes based on weather conditions

## Testing With Mock Data

To test the app with mock data on Android and iOS devices:

### Testing on Android

1. **Setup Android Studio**:
   - Install Android Studio
   - Configure an Android Virtual Device (AVD) with API level 29+
   - Start the emulator

2. **Launch the App**:
   ```
   npm run android
   ```

3. **Testing the Mock Weather UI**:
   - On the home screen, use the weather icons at the top to switch between weather conditions
   - The UI will automatically update with:
     - New color scheme based on weather
     - Weather information display
     - Appropriate clothing suggestions

### Testing on iOS (macOS only)

1. **Setup Xcode**:
   - Install Xcode from the Mac App Store
   - Open Xcode and set up a simulator (iPhone 11 or later recommended)

2. **Launch the App**:
   ```
   npm run ios
   ```

3. **Testing the Mock Weather UI**:
   - Follow the same steps as Android testing

### Test Scenarios

1. **Weather Toggle Test**:
   - Tap the sun icon to view the sunny weather theme with light clothing suggestions
   - Tap the rain icon to see waterproof clothing and accessories
   - Tap the cloud icon to check cloudy weather recommendations
   - Tap the snow icon to view winter clothing suggestions
   - Tap the moon icon to see the night theme

2. **Settings Test**:
   - Navigate to Settings screen by tapping the gear icon
   - Enter a location (e.g., "New York") and save
   - Toggle temperature unit between Celsius and Fahrenheit
   - Enable notifications and save settings
   - Return to home screen to verify changes were applied

3. **UI Adaptation Test**:
   - Observe how the UI adapts to each weather condition
   - Verify color schemes change appropriately
   - Confirm clothing suggestions match the weather conditions

## Technology Stack

- React Native / Expo
- TypeScript
- React Navigation
- OpenWeatherMap API (will be integrated in next phase)
- AsyncStorage for local data persistence
- Jest and React Testing Library for testing

## Project Structure

The application follows a modular architecture with the following structure:

- **src/components/**: UI components following atomic design principles
- **src/screens/**: Main application screens
- **src/services/**: API integration services
- **src/navigation/**: Navigation configuration
- **src/utils/**: Helper functions and utilities
- **src/assets/**: Static assets like images and fonts
- **src/__tests__/**: Test suites for components
- **src/__mocks__/**: Mock data for testing

## Getting Started

### Prerequisites

- Node.js and npm/yarn
- Expo CLI
- Android Studio or Xcode (for emulators)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```
3. Start the application:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```
4. Run on Android or iOS:
   ```
   npm run android
   ```
   or
   ```
   npm run ios
   ```

## Testing

Run tests with:

```
npm test
```

## Development Status

This project is currently in MVP development with focus on implementing core features:
- [x] Project setup and structure
- [x] Weather-responsive UI with mock data
- [~] User can specify their location
- [~] User can see the weather forecast for the day
- [~] User sees a list of clothing suggestions for each time of day
