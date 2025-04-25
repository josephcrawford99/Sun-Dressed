# Climate Closet

A mobile application that suggests what to wear based on the weather forecast.

## Overview

Climate Closet is designed to help users decide what to wear based on current and forecasted weather conditions. The app provides clothing recommendations for different times of the day (morning, afternoon, and evening) to ensure you're prepared for changing weather conditions.

## How to Run the Mock App Demo

This guide will help you run the interactive mockup of the Climate Closet app on your computer.

### Prerequisites (One-time setup)

1. **Install Node.js**:
   - Download and install Node.js from [https://nodejs.org/](https://nodejs.org/) (Download the "LTS" version)
   - This includes npm (Node Package Manager), which we'll use to install dependencies and run the app

2. **Verify Installation**:
   - After installation, open Command Prompt (Windows) or Terminal (Mac/Linux)
   - Type these commands to verify installation:
     ```
     node --version
     npm --version
     ```
   - Both should display version numbers if installed correctly

### Running the Mock App Demo

1. **Download the Project**:
   - If you received the project as a ZIP file: Extract it to a folder on your computer
   - If using GitHub: Clone the repository to your local machine

2. **Open Command Prompt or Terminal**:
   - Navigate to the project folder:
     ```
     cd path/to/climate-closet
     ```
   - Replace "path/to/climate-closet" with the actual path to the folder

3. **Install Dependencies**:
   - Run this command to install all required packages:
     ```
     npm install --legacy-peer-deps
     ```
   - This may take a few minutes to complete

4. **Start the Web Demo**:
   - Run this command to start the mockup in web mode:
     ```
     npm run web
     ```
   - The app will automatically open in your default web browser
   - If it doesn't open automatically, try visiting: http://localhost:19006

5. **Interact with the Mock App**:
   - Use the weather icons at the top to switch between different weather conditions
   - Observe how the UI adapts with different themes and clothing suggestions
   - Navigate to different screens using the buttons/menu items

6. **Stopping the App**:
   - To stop the app, return to the Command Prompt/Terminal window
   - Press Ctrl+C, then confirm with Y if prompted

### Troubleshooting

1. **"npm not recognized" error**:
   - Make sure Node.js is installed correctly
   - Try restarting your computer and opening a new Command Prompt/Terminal

2. **Errors during installation**:
   - Try running the install command with administrator privileges
   - On Windows: Right-click Command Prompt and select "Run as administrator"
   - On Mac/Linux: Use `sudo npm install --legacy-peer-deps`

3. **Browser shows blank page**:
   - Try manually navigating to http://localhost:19006
   - Check if there are any error messages in the Command Prompt/Terminal

4. **App won't start**:
   - Try running: `npx expo-cli start --web` instead

If you encounter any issues not covered here, please contact the development team for assistance.

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

To test the app with mock data:

### Testing on Web (Recommended for Development)

1. **Launch the App in Web Mode**:
   ```
   npm run web
   ```

2. **Testing the Mock Weather UI**:
   - The app will open in your default browser at localhost:19006
   - Use the weather icons at the top to test different weather conditions
   - Observe theme changes and clothing suggestions

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

## Getting Started (For Developers)

### Prerequisites

- Node.js and npm/yarn
- Expo CLI
- Android Studio or Xcode (for emulators)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install --legacy-peer-deps
   ```
   The `--legacy-peer-deps` flag is needed to resolve dependency conflicts with React versions.

3. Start the application:
   ```
   npm start
   ```
   or for web:
   ```
   npm run web
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

## Troubleshooting

### Common Issues

1. **Missing module errors**:
   - Run `npm install --legacy-peer-deps` to install dependencies with compatibility mode

2. **React Native Web Issues**:
   - If web mode doesn't work, run `npm install react-native-web react-dom @expo/webpack-config@^18.0.1 --legacy-peer-deps`

3. **Expo CLI Not Found**:
   - We're using `npx` in the package.json scripts, which doesn't require global installation

4. **Type Errors**:
   - Type errors in development mode won't prevent the app from running
   - Install missing type definitions: `npm install --save-dev @types/react @types/react-native`

## Development Status

This project is currently in MVP development with focus on implementing core features:
- [x] Project setup and structure
- [x] Weather-responsive UI with mock data
- [~] User can specify their location
- [~] User can see the weather forecast for the day
- [~] User sees a list of clothing suggestions for each time of day
