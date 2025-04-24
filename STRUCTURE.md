# Project Structure

## src/
- Main container for all application code

### src/assets/
- Static assets (images, fonts)
- Weather icons and clothing images

### src/components/
- Reusable UI components following atomic design
- Button.tsx - Customizable button component
- Card.tsx - Container component for displaying content
- WeatherDisplay.tsx - Component for displaying weather information
- ClothingSuggestion.tsx - Component for displaying clothing suggestions
- WeatherIcon.tsx - Component for rendering weather condition icons
- MockWeather.tsx - Component for displaying mock weather data during development

### src/screens/
- Main application screens
- HomeScreen.tsx - Main screen showing weather and clothing suggestions
- SettingsScreen.tsx - Screen for configuring user location and preferences
- LocationScreen.tsx - Screen for setting and managing user location

### src/services/
- API integration services
- weatherService.ts - Fetches weather data from OpenWeatherMap API
- clothingService.ts - Provides clothing suggestions based on weather conditions
- locationService.ts - Handles geolocation and location management

### src/utils/
- Helper functions and utilities
- storage.ts - AsyncStorage utilities for saving and retrieving user data
- weatherUtils.ts - Formatting and conversion utilities for weather data
- constants.ts - Application-wide constants and configuration
- mockData.ts - Mock data for testing and development
- ThemeContext.tsx - Theme provider and context hook for app theming

### src/navigation/
- Navigation configuration
- AppNavigator.tsx - Main navigation stack configuration
- navigationTypes.ts - TypeScript types for navigation

### src/__tests__/
- Test files for components and services
- Components/ - Tests for UI components
- Services/ - Tests for service functions

### src/__mocks__/
- Mock implementations for testing
- weatherData.ts - Mock weather data for development and testing
- clothingData.ts - Mock clothing suggestion data

## Root Files
- App.tsx - Main application entry point
- package.json - Project dependencies and scripts
- tsconfig.json - TypeScript configuration
- babel.config.js - Babel configuration
- jest.setup.js - Jest configuration for testing

## Documentation
- README.md - Project overview and setup instructions
- specifications.md - Feature tracking and requirements
- STRUCTURE.md - Project structure documentation
