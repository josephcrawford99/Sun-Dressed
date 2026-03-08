<p align="center">
  <img src="assets/images/logo.png" alt="Sun Dressed" width="300">
</p>

A weather-based outfit recommendation app for iOS. Give it your style preferences and it will put together an outfit for your day based on real-time weather conditions. It also supports trip planning, so you can pack smarter for upcoming travel.

[Download on the App Store](https://apps.apple.com/app/sun-dressed)

## Built With

- React Native / Expo (SDK 54) with TypeScript
- Expo Router for file-based navigation
- Google Gemini API for generating outfit recommendations
- OpenWeatherMap API for real-time weather data
- TanStack React Query for async state management
- AsyncStorage for local persistence
- Custom component library with full theming support

## Project Structure

- `app/` - Screens and tab navigation (Expo Router)
- `components/` - Reusable UI components
- `services/` - API integrations (Gemini, OpenWeatherMap)
- `hooks/` - Custom hooks for weather, clothing recommendations, closet, and trip planning
- `store/` - Local state management
- `constants/` - Theme colors, typography, and config

## Privacy

[Privacy Policy](https://josephcrawford99.github.io/Sun-Dressed/privacy-policy/)