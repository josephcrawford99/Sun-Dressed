# Test Suite - Sun Dressed App

## Enterprise React Native Testing Structure

This test suite follows 2025 best practices for enterprise React Native applications using Jest and React Testing Library.

## Directory Structure

```
test/
├── components/         # Component-specific tests
├── hooks/             # Custom hooks testing
├── services/          # Service layer tests (APIs, storage)
├── integration/       # End-to-end feature flows
├── auth/              # Authentication system tests
├── weather/           # Weather API integration tests
├── __mocks__/         # Mock implementations
├── __fixtures__/      # Test data fixtures
├── utils/             # Test utilities and helpers
└── README.md          # This file
```

## Testing Categories

### ✅ Existing Features (Should Pass)
Tests for implemented functionality:
- Trip CRUD operations (useTrips hook + tripStorageService)
- AI outfit generation service (outfitService with Gemini API)
- Trip display UI (TripCard component, trips screen)
- Basic outfit display (BentoBox component - display only)

### ❌ Future Features (Should Fail Initially)
Tests for unimplemented functionality that will pass when implemented:
- Weather API integration
- Location autocomplete with Google Places
- BentoBox user interactions (state machine)
- Authentication system
- Real weather data in outfit generation

## Test Execution

```bash
# Run all tests
npm test

# Run specific test categories
npm test -- test/components/
npm test -- test/hooks/
npm test -- test/services/

# Run with coverage
npm test -- --coverage

# Watch mode for development
npm test -- --watch
```

## Key Testing Principles

1. **User-Centric**: Test what users see and interact with
2. **Outcome-Based**: Focus on behavior, not implementation details
3. **Future-Proof**: Tests for unimplemented features should require no changes
4. **Enterprise-Scale**: Organized for maintainability and CI/CD integration

## Mock Strategy

- **External APIs**: Weather, Google Places, Gemini AI
- **React Native Modules**: AsyncStorage, Navigation, Platform-specific code
- **Third-party Libraries**: Preserve business logic while mocking I/O

## Test Data

All test fixtures are located in `__fixtures__/` and represent realistic application data scenarios.