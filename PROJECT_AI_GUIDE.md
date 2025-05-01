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
- **State Management**: Context API (planned)
- **Navigation**: React Navigation
- **Weather API**: OpenWeatherMap API
- **Storage**: AsyncStorage (local storage)
- **Authentication**: In development
- **Styling**: React Native StyleSheet

## Code Structure

The project follows a modular architecture:

```
src/
├── assets/             # Static assets (images, fonts)
├── components/         # Reusable UI components
├── screens/           # Main application screens
├── services/          # API integration services
├── utils/             # Helper functions, context providers
├── navigation/        # Navigation configuration
├── types/             # TypeScript interfaces and types
├── styles/            # Global styles and themes
├── __tests__/         # Test files
└── __mocks__/         # Mock data for testing
```

## Development Status (Based on specifications.md)

### Phase 1 (Core Infrastructure): In Progress
- [x] Project setup and basic structure
- [~] User authentication system (partially implemented)
- [x] Primary view with placeholder data
- [ ] Database schema design (not started)

### Phase 2 (Weather Integration): In Progress
- [~] Weather API integration (basic implementation)
- [~] Location specification
- [~] Weather forecast display

### Phase 3 (Clothing Recommendation): Partially Started
- [x] Mock clothing suggestions
- [ ] Recommendation algorithm (not implemented)

### Phases 4-8: Not Yet Started

## Key Files Quick Reference

- **App.tsx**: Entry point with basic app setup
- **src/navigation/AppNavigator.tsx**: Main navigation structure
- **src/screens/HomeScreen.tsx**: Main screen with weather and outfit display
- **src/services/weatherService.ts**: Weather API integration (in progress)

## Development Guidelines

### Code Style Guidelines
1. **Styling Priority**:
   - Use centralized themes and styles
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

### Git Workflow
- **Main Branch**: Stable releases only
- **Develop Branch**: Integration branch
- **Feature Branches**: Named `feature/[feature-name]`
- **Test Branches**: Named `test/[feature-name]`
- **Commit Message Format**: "[Feature/Fix/Refactor]: Brief description"

### Testing Requirements
- Each completed feature requires:
  - Unit tests for core functionality
  - Integration tests for user flows
  - Manual verification on both iOS and Android
  - Cross-device testing on at least 2 screen sizes

## Common Issues & Solutions

### Weather Data
- OpenWeatherMap API has rate limiting
- The API key used is: 55c56ace4bd5079cdbcfa7b8804a5562
- Caching implementation is planned
- Default units are metric (Celsius)

### Styling Challenges
- Theme consistency is being established
- Goal is to centralize all styles
- Current implementation has scattered styles

## Quick Navigation Tips

When developing a new feature, follow this sequence:
1. Check specifications.md to understand requirements
2. Review relevant existing components
3. Ask the user relevant queries to reduce token usage. The questions will be fed to an external web searching and reasoning tool.
4. Update or create components following the atomic design pattern
5. Add to the appropriate screen
6. Add tests
7. Update specifications.md

## Documentation References

- specifications.md: Feature tracking and requirements
- STRUCTURE.md: Detailed project structure
- README.md: User-facing documentation and setup

## Development Best Practices

- **Code Changes**: Make one type of change at a time
- **Testing**: Test each change on both iOS and Android simulators when possible
- **Commit Strategy**: Make atomic commits that focus on a single improvement
- **Documentation**: Update comments and documentation as you implement fixes
- **Rate Limits**: Be mindful of API rate limits during development and testing

---

This document is designed for AI assistants working on the Sun Dressed app. Always refer to the actual code for the most up-to-date implementation details. The goal is to write high-quality, maintainable code that follows the established patterns while optimizing for reuse and performance.
