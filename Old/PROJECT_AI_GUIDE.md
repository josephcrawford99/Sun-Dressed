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
│   ├── mock/           # Mock images for development
│   └── clothing/       # Clothing images for outfit recommendations
├── components/         # Reusable UI components
├── screens/            # Main application screens
├── services/           # API integration services
├── utils/              # Helper functions, context providers
├── navigation/         # Navigation configuration
├── types/              # TypeScript interfaces and types
├── styles/             # Global styles and themes
├── data/               # JSON data files (e.g., clothingData.json)
├── __tests__/          # Test files
└── __mocks__/          # Mock data for testing
```

## Development Status (Based on specifications.md)

### Phase 1 (Core Infrastructure): In Progress
- [x] Project setup and basic structure
- [~] User authentication system (partially implemented)
- [x] Primary view with placeholder data
- [ ] Database schema design (not started)

### Phase 2 (Weather Integration): In Progress
- [x] Weather API integration (implemented)
- [x] User can specify their location
- [x] User can see the weather forecast for the day (weather view)

### Phase 3 (Clothing Recommendation): Implemented
- [x] User sees a list of clothing suggestions for entire day from generic json
- [x] Create algorithm for matching weather conditions to appropriate clothing
- [~] Implement caching for offline access to recent suggestions (partially implemented)

### Phase 4 (User Feedback Loop): Implemented
- [x] User can rate day's outfit for factors such as too cold or hot
- [x] Store and process user feedback to improve future recommendations
- [ ] Implement analytics tracking for feature usage and app performance (not started)

### Phases 5-8: Not Yet Started

## Key Files Quick Reference

- **App.tsx**: Entry point with basic app setup
- **src/navigation/AppNavigator.tsx**: Main navigation structure
- **src/screens/HomeScreen.tsx**: Main screen with weather and outfit display, now includes outfit recommendations
- **src/services/weatherService.ts**: Weather API integration
- **src/services/outfitService.ts**: Clothing recommendation logic
- **src/data/clothingData.json**: Database of clothing items with weather suitability
- **src/utils/clothingImages.ts**: Helper for mapping clothing items to images
- **src/assets/clothing/README.md**: Documentation for adding clothing images

## Clothing Recommendation System

The clothing recommendation system is now integrated into HomeScreen.tsx. Key features include:

1. **Weather-based Recommendations**: Outfits are recommended based on current weather conditions
2. **User Preferences**: System adjusts recommendations based on user's temperature comfort
3. **Feedback Mechanisms**: 
   - Temperature feedback (Too Cold, Just Right, Too Hot)
   - Item-specific feedback (Like/Dislike)
4. **Persistence**: User preferences are stored in AsyncStorage
5. **Image System**: Modular system for clothing images in src/assets/clothing/

To add new clothing images:
1. Place images in the appropriate subfolder in src/assets/clothing/
2. Update the mapping in src/utils/clothingImages.ts

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

### Outfit Recommendations
- Initial outfit recommendations use the mock images (src/assets/mock/)
- Add real clothing images to src/assets/clothing/ subfolders
- Reference new images in src/utils/clothingImages.ts
- The system handles both top+bottom combinations and dresses

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
- src/assets/clothing/README.md: Guidelines for clothing images

## Development Best Practices

- **Code Changes**: Make one type of change at a time
- **Testing**: Test each change on both iOS and Android simulators when possible
- **Commit Strategy**: Make atomic commits that focus on a single improvement
- **Documentation**: Update comments and documentation as you implement fixes
- **Rate Limits**: Be mindful of API rate limits during development and testing

---

This document is designed for AI assistants working on the Sun Dressed app. Always refer to the actual code for the most up-to-date implementation details. The goal is to write high-quality, maintainable code that follows the established patterns while optimizing for reuse and performance.
