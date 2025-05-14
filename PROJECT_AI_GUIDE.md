# Sun Dressed - Implementation Guide

This document serves as the comprehensive guiding reference for AI agents working on the Sun Dressed weather-based outfit recommendation app. It outlines the current implementation status, code organization, development standards, and future implementation plans.

## Project Overview

Sun Dressed is a React Native app built with Expo that provides weather-appropriate outfit recommendations. The app was previously implemented but is being refactored from scratch for improved code organization and maintainability. The old implementation in `C:\Users\NCWDG_Developer\Desktop\WeatherApp\Old` should only be used as a visual style reference, not for implementation or file structure guidance.

## Development Standards

- **Component Organization**: Each screen is implemented as a standalone .tsx file
- **Type Management**: Component-specific types are co-located within component files; shared types are in the types directory
- **Styling**: Avoid inline styles in favor of StyleSheet objects
- **Error Handling**: Comprehensive input validation and structured error handling in all API interfaces
- **Testing**: Unit tests for core algorithm functions, component snapshot tests, integration tests for flows, and mock API tests

## Implementation Progress

### Phase 1: Core Infrastructure (COMPLETED)
1. ✅ App.tsx - Main entry point with error boundary and font loading
2. ✅ HomeScreen.tsx - Main screen with weather display and clothing recommendations
3. ✅ FlipContainer.tsx - Component that flips between weather and outfit views
4. ✅ WeatherCustomButton.tsx - Button that triggers the flip animation
5. ✅ LocationBar.tsx - Simple location input (to be enhanced later)
6. ✅ CalendarStrip.tsx - Calendar strip component showing days of the week

### Context Management (COMPLETED)
1. ✅ AuthContext.tsx - Basic authentication context with mock user
2. ✅ SettingsContext.tsx - Settings for temperature and wind units

### Utility Files (COMPLETED)
1. ✅ weatherIcons.ts - Maps weather codes to icons
2. ✅ timeService.ts - Handles time-of-day based greetings
3. ✅ useWeather.ts - Mock weather service (to be connected to real API in Phase 2)
4. ✅ typography.ts - Typography styles
5. ✅ theme.ts - Theme constants for colors and spacing
6. ✅ outfitAlgorithm.ts - Outfit suggestion algorithm
7. ✅ clothingData.json - Sample clothing data for testing

## Component Hierarchy

```
App
├── Navigation
│   └── NavBar (on multiple screens)
├── Screens
│   ├── AuthScreen
│   ├── SignUpScreen
│   ├── HomeScreen
│   │   ├── LocationBar ✅
│   │   ├── WeatherCustomButton ✅
│   │   ├── FlipContainer ✅
│   │   │   ├── WeatherCard
│   │   │   └── CardContainer
│   │   │       └── BentoBoxCard
│   │   │           └── BentoBoxElement
│   │   ├── CalendarStrip ✅
│   ├── SettingsScreen
│   ├── AccountScreen
│   ├── LoadingScreen
│   ├── HangerScreen (future implementation)
│   └── SocialScreen (future implementation)
├── Contexts
    ├── AuthContext ✅
    └── SettingsContext ✅
```

## Next Atomic Step

The next atomic implementation step is to create the BentoBoxCard and BentoBoxElement components that will display outfit recommendations from the outfit algorithm:

1. Create `src/components/BentoBoxElement.tsx` - Individual clothing item display
2. Create `src/components/BentoBoxCard.tsx` - Container for outfit elements
3. Create `src/components/CardContainer.tsx` - Swipeable container for multiple outfit cards
4. Update `FlipContainer.tsx` to include the CardContainer component
5. Connect the outfit algorithm to these UI components

## Screen Implementations

### HomeScreen (Currently Implemented)
- Displays greeting based on time of day
- Shows LocationBar with current location
- Contains WeatherCustomButton to flip between weather and outfit views
- Includes CalendarStrip for date selection
- Will display outfit recommendations using BentoBox components

### AuthScreen (To be Implemented)
- Will provide sign-in with Google and Apple options
- Email and password entry fields
- Option to navigate to SignUpScreen
- Will connect to AuthContext for authentication

### SignUpScreen (To be Implemented)
- Email and password entry with validation
- Style preference selection (masculine/feminine/neutral)
- Preferred units selection (°F/°C, mph/km/h)
- Will connect to AuthContext for user creation

### SettingsScreen (To be Implemented)
- Temperature unit selection (°F/°C)
- Wind speed unit selection (mph/km/h)
- Style preference selection
- Other customization options

### AccountScreen (To be Implemented)
- User profile management
- Update name, email, password
- Preferences management

### LoadingScreen (To be Implemented)
- Skeleton screens for loading states longer than 300ms
- Full-screen loader with app logo for authentication
- Inline component loading states for data refreshes

## Components to Implement

### NavBar
- Bottom navigation between HomeScreen, HangerScreen, SocialScreen, and AccountScreen
- Highlights current active screen
- Simple button-based navigation

### WeatherCard (To be Implemented)
- Shows current weather conditions
- Displays temperature, "feels like" temperature, wind speed, and precipitation
- May include hourly forecast in future iterations

### BentoBoxCard (Implemented)
- Displays a complete outfit recommendation
- Contains BentoBoxElements arranged in a grid
- Shows outfit components separated into logical sections
- Has a specific layout with two columns (left and right)

### BentoBoxElement (Implemented)
- Displays individual clothing items
- Static layout with no animations or expansion effects
- Text labels rotate 90 degrees counterclockwise
- Left column elements (Top/Bottom or Dress) reach from top to bottom of container with only margin gaps
- Outerwear elements squash horizontally when multiple exist
- Accessories stack vertically and squash when multiple are present
- Top and bottom elements each take 48% of the container height
- A dress element takes 100% of the left column height
- No interaction capabilities currently implemented

## Outfit Suggestion Algorithm (Implemented)

The outfit suggestion algorithm has been implemented in:

1. `src/types/clothing.ts` - TypeScript interfaces for clothing data
2. `src/mocks/clothingData.json` - Sample clothing data with 32 items across categories
3. `src/utils/outfitAlgorithm.ts` - Main algorithm implementation
4. `src/utils/outfitAlgorithmTest.ts` - Test utility
5. `src/test/outfitSuggestionTest.js` - Test demonstrations

The algorithm:
- Filters clothing based on style preference and seasonal appropriateness
- Generates outfits based on temperature and weather conditions
- Scores outfits based on temperature appropriateness (40%), weather protection (15%), user preference (25%), style cohesion (10%), and recency (10%)
- Adapts to user feedback by updating item properties

## API Interfaces to Implement

### Weather API Integration
- Connect to OpenWeatherMap API in useWeather.ts
- Implement error handling for API failures
- Add caching for reduced API calls

### Supabase API (Future Implementation)
- Authentication (login, registration)
- User data persistence
- Settings storage
- Outfit preferences

### Local Storage Implementation
- Cache username and password for auto-login
- Store settings and preferences
- Save location history
- Implement cache invalidation and refresh mechanisms

## Styles

Currently implemented styles:
- **Fonts**: Libre Baskerville and Montserrat
- **BorderRadius**: 8px for buttons and UI elements
- **Colors**:
  - `#000`: Full black for buttons with white text, outlines, and primary text
  - `#757575`: Gray for box components like BentoBoxElements
  - `#fff`: Full white for most backgrounds
  - `#FFEE8C`: Yellow as accent color (use sparingly)

## Testing Strategy

- Unit tests for core algorithm functions
- Component snapshot tests for UI elements
- Integration tests for authentication flow
- Mock API tests for weather data handling

## Branching Strategy

Feature branches named `feature/feature-name` that merge into `develop`, with proper testing before merging to `main`. Each feature has its own branch to isolate changes.

## Additional Resources

### Clothing Data
The clothingData.json file contains 32 clothing items across categories:
- 6 tops (varying warmth levels)
- 5 dresses (varying styles and warmth)
- 7 bottoms (from shorts to sweatpants)
- 7 shoes (from flip-flops to winter boots)
- 7 accessories (sun protection, rain protection, and warmth items)

Each item has properties for warmth, style, formality, seasonal appropriateness, weather protection, and cohesion with other items.

## Running the Tests

To test the outfit suggestion algorithm:
```
cd C:\Users\NCWDG_Developer\Desktop\WeatherApp
node src/test/outfitSuggestionTest.js
```

This runs scenarios for different weather conditions and shows the recommended outfits.
