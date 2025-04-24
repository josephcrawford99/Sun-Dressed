# Project Structure

## src/
- Main container for all application code

### src/assets/
- Static assets (images, fonts)
- Weather icons and clothing images

### src/components/
- Reusable UI components following atomic design
- Button, Card, WeatherDisplay, ClothingSuggestion, etc.

### src/screens/
- Main application screens
- HomeScreen.tsx - Main screen showing weather and clothing suggestions
- SettingsScreen.tsx - Screen for configuring user location and preferences

### src/services/
- API integration services
- weatherService.ts - Fetches weather data from OpenWeatherMap API
- clothingService.ts - Provides clothing suggestions based on weather conditions

### src/utils/
- Helper functions and utilities
- storage.ts - AsyncStorage utilities for saving and retrieving user data
- weatherUtils.ts - Formatting and conversion utilities for weather data

### src/navigation/
- Navigation configuration
- AppNavigator.tsx - Main navigation stack configuration

## Root Files
- App.tsx - Main application entry point
- package.json - Project dependencies and scripts
- tsconfig.json - TypeScript configuration
- babel.config.js - Babel configuration

## Documentation
- README.md - Project overview and setup instructions
- specifications.md - Feature tracking and requirements
