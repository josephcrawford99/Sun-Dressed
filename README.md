# Climate Closet

A mobile application that suggests what to wear based on the weather forecast.

## Overview

Climate Closet is designed to help users decide what to wear based on current and forecasted weather conditions. The app provides clothing recommendations for different times of the day (morning, afternoon, and evening) to ensure you're prepared for changing weather conditions.

## Features

- **Weather Information**: View current weather conditions and forecasts
- **Clothing Suggestions**: Receive personalized clothing recommendations based on weather conditions
- **Location Settings**: Set and save your location for accurate weather data
- **User Preferences**: Customize your experience with preference settings

## Technology Stack

- React Native / Expo
- TypeScript
- React Navigation
- OpenWeatherMap API
- AsyncStorage for local data persistence

## Project Structure

The application follows a modular architecture with the following structure:

- **src/components/**: UI components following atomic design principles
- **src/screens/**: Main application screens
- **src/services/**: API integration services
- **src/navigation/**: Navigation configuration
- **src/utils/**: Helper functions and utilities
- **src/assets/**: Static assets like images and fonts

## Getting Started

### Prerequisites

- Node.js and npm/yarn
- Expo CLI
- OpenWeatherMap API key

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
3. Update the API key in src/services/weatherService.ts
4. Start the application:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

## Development Status

This project is currently in MVP development with focus on implementing core features:
- [x] Project setup and structure
- [ ] User can specify their location
- [ ] User can see the weather forecast for the day
- [ ] User sees a list of clothing suggestions for each time of day
