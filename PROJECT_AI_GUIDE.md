# Sun Dressed (formerly Climate Closet) - AI Assistant Guide

This document is designed to help AI assistants quickly understand and work with the Sun Dressed application. It contains essential information about project structure, development status, and guidelines for efficient assistance.

## Project Overview

Sun Dressed is a mobile application that suggests clothing based on weather conditions. The app integrates with OpenWeatherMap API to fetch weather data and provides personalized outfit recommendations. It's built with React Native/Expo and TypeScript.

## Project Evolution

- Original Name: "Climate Closet"
- Current Name: "Sun Dressed"
- This is an important detail as code, files, and references may still use the older name

## Technology Stack

- **Frontend**: React Native/Expo, TypeScript
- **State Management**: Context API
- **Navigation**: React Navigation
- **Weather API**: OpenWeatherMap API
- **Storage**: AsyncStorage (local storage)
- **Authentication**: Supabase
- **Styling**: React Native StyleSheet

## Code Structure

The project follows a modular architecture:

```
src/
├── assets/             # Static assets (images, fonts)
├── components/         # Reusable UI components 
├── screens/            # Main application screens
├── services/           # API integration services
├── utils/              # Helper functions, context providers
├── navigation/         # Navigation configuration
├── types/              # TypeScript interfaces and types
├── styles/             # Global styles and themes
├── __tests__/          # Test files
└── __mocks__/          # Mock data for testing
```

## Key Files Quick Reference

- **App.tsx**: Entry point with providers (ThemeProvider, AuthProvider)
- **src/navigation/AppNavigator.tsx**: Main navigation structure
- **src/screens/HomeScreen.tsx**: Main screen with weather and outfit display
- **src/services/weatherService.ts**: Weather API integration
- **src/utils/useWeather.ts**: Custom hook for weather data
- **src/utils/AuthContext.tsx**: Authentication provider
- **src/utils/ThemeContext.tsx**: Theme provider
- **src/utils/constants.ts**: Important constants (API keys, defaults)

## Development Status (Based on specifications.md)

- Phase 1 (Core Infrastructure): Partially completed
  - Project setup and basic structure ✓
  - User authentication system: Partially implemented via Supabase
  - Primary view with placeholder data ✓
  - Database schema design: Not started

- Phase 2 (Weather Integration): Partially completed
  - Weather API integration ✓
  - Location specification ✓
  - Weather forecast display ✓

- Phase 3 (Clothing Recommendation): Partially implemented
  - Mock clothing suggestions ✓
  - Actual recommendation algorithm: Not implemented

- Phases 4-8: Not yet started

## Humanization Strategies

When writing code for this project, implement these strategies to create more natural, human-like code:

- Use domain-specific variable names instead of generic ones (e.g., "outfitSuggestion" vs "data")
- Add personal reasoning in comments explaining "why" not just "what"
- Avoid perfect, overly-verbose documentation patterns
- Implement strategically inconsistent (but still readable) formatting
- Use more complex control flow than typically seen in AI-generated code
- Add custom error handling with personality
- Prefer custom components over pre-built libraries where reasonable

## Major Components

### Authentication System
- Uses Supabase for auth
- User data stored in Supabase
- AuthContext provider handles auth state

### Weather System
- OpenWeatherMap API integration
- Location management
- Caching for offline access
- Error handling and fallbacks

### UI Components
- Follows atomic design principles
- Components should be <150 lines
- All components use TypeScript interfaces
- Centralized styling is preferred

## Code Style Guidelines

1. **Styling Priority**:
   - Use centralized themes and styles from src/styles/
   - Avoid inline styles when possible
   - Reuse style constants

2. **Component Standards**:
   - Use functional components with hooks
   - Follow atomic design pattern
   - Extract complex logic to custom hooks
   - Use TypeScript interfaces for all props

3. **Performance Considerations**:
   - Use React.memo for performance-critical components
   - Implement FlatList for long lists
   - Handle loading states appropriately

## Development Workflow & Git Integration

### Feature Tracking
- Follow specifications.md as the source of truth for development
- Mark features using the following conventions:
  - [ ] Unstarted feature
  - [~] In-progress feature
  - [x] Completed and tested feature
- Add comment with date when marking features complete
- Include test coverage information when completing features
- All MVP features must be completed before starting any "Further features"

### Git Workflow
- **Main Branch**: Stable releases only
- **Develop Branch**: Integration branch for ongoing development
- **Feature Branches**: Named `feature/[feature-name]`
- **Test Branches**: Named `test/[feature-name]`
- **Commit Message Format**: "[Feature/Fix/Refactor]: Brief description"

### Testing Requirements
- Each completed feature requires:
  - Unit tests for core functionality
  - Integration tests for user flows
  - Manual verification on both iOS and Android
  - Cross-device testing on at least 2 screen sizes

## README.md Management

- Update README.md after each feature completion
- Features section should mirror specifications.md (complete/incomplete)
- Installation instructions must be verified with each update
- Update screenshots as UI features are implemented
- Update technology stack as new libraries are added
- Use GitHub-flavored markdown
- Include badges for build status and version
- Use relative links for navigation

## Post-MVP Considerations

After completing the MVP features, consider these for portfolio enhancement:
- Add App Store Optimization techniques
- Implement analytics for user engagement
- Add dark/light mode with system synchronization
- Use React Native Reanimated for smooth transitions
- Integrate with third-party APIs beyond weather
- Implement growth features (social sharing, referral program)

## Common Issues & Solutions

### Weather Data
- OpenWeatherMap API has rate limiting
- The API key used is: 55c56ace4bd5079cdbcfa7b8804a5562
- Caching is implemented to help with rate limits
- Default units are metric (Celsius)

### Styling Challenges
- Theme consistency across the app has been a challenge
- Goal is to centralize all styles in a single location
- Current implementation has styles scattered across components

### Code Reuse
- Optimization for code reuse is a priority
- Extract common functionality to separate modules
- Use hooks for shared logic

## Quick Navigation Tips

When developing a new feature, follow this sequence:
1. Check specifications.md to understand requirements
2. Review relevant existing components
3. Update or create components following the atomic design pattern
4. Add to the appropriate screen
5. Add tests
6. Update specifications.md

## Key Development Areas

1. **Authentication Flow Enhancement**:
   - Password reset functionality
   - User profile management

2. **Weather Integration Refinement**:
   - Improve error handling
   - Add multi-day forecast
   - Weather data caching improvements

3. **Clothing Recommendation Engine**:
   - Implement actual logic based on temperature thresholds
   - Connect user preferences to recommendations
   - Implement feedback mechanism

4. **UI/UX Improvements**:
   - Consistent theming across the app
   - Performance optimizations
   - Responsive design enhancements

## Documentation References

- specifications.md: Feature tracking and requirements
- STRUCTURE.md: Detailed project structure
- README.md: User-facing documentation and setup
- code-improvements.md: Comprehensive analysis of code issues and solutions

## Pending Code Improvements

A comprehensive code audit has been performed and documented in `code-improvements.md`. This file contains detailed analysis of issues and proposed solutions for making the codebase more robust, succinct, and readable.

**Important: When continuing work on this project, review the code-improvements.md file first and begin implementing those fixes.**

The key improvement areas identified are:

1. **Weather Service Improvements**:
   - Complete the `getForecast` method implementation in `weatherService.ts`
   - Consolidate time of day logic between files

2. **API Key Security**:
   - Move the OpenWeatherMap API key from hard-coding to environment variables

3. **Error Handling and Offline Resilience**:
   - Enhance error handling with more descriptive states
   - Add visual indicators for cached data

4. **Performance Optimizations**:
   - Break down large components (especially HomeScreen)
   - Use memoization for computed values and component renders
   - Improve rate limiting persistence

5. **Code Organization and Style**:
   - Extract the large StyleSheet in HomeScreen to themed style files
   - Standardize export patterns

6. **Type Definitions**:
   - Add comprehensive type definitions for all objects
   - Eliminate uses of `any` type

7. **Clothing Recommendation Algorithm**:
   - Implement the temperature-based clothing recommendation algorithm

## Development Best Practices

- **Code Changes**: Make one type of change at a time (e.g., fix one issue before moving to the next)
- **Testing**: Test each change on both iOS and Android simulators when possible
- **Commit Strategy**: Make atomic commits that focus on a single improvement
- **Documentation**: Update comments and documentation as you implement fixes
- **Rate Limits**: Be mindful of API rate limits during development and testing

---

This document is designed for AI assistants working on the Sun Dressed app. Always refer to the actual code for the most up-to-date implementation details. The goal is to write high-quality, maintainable code that follows the established patterns while optimizing for reuse and performance. Refer to code-improvements.md for detailed analysis of issues and solutions.
