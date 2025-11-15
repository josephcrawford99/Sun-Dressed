# Testing Documentation for Sun Dressed

This directory contains all automated tests for the Sun Dressed application. We follow industry-standard testing practices using Jest and React Native Testing Library.

## Testing Philosophy

Our testing strategy follows the **Testing Pyramid** principle:
- **70% Unit Tests**: Fast, isolated tests for individual functions and modules
- **20% Integration Tests**: Tests for component interactions and workflows
- **10% E2E Tests**: Full user workflow tests (not included in this implementation)

We focus on **testing behavior, not implementation**, ensuring tests are resilient to refactoring.

## Directory Structure

```
__tests__/
├── README.md                    # This file - testing documentation
├── test-helpers/                # Reusable test utilities and mocks
│   └── index.ts                 # Mock data creators and helpers
├── unit/                        # Unit tests for individual modules
│   ├── utils/                   # Tests for utility functions
│   ├── services/                # Tests for API services
│   ├── store/                   # Tests for state management
│   ├── hooks/                   # Tests for custom hooks (future)
│   └── components/              # Tests for UI components
│       └── ui/                  # Tests for UI component library
├── integration/                 # Integration tests (future)
│   └── workflows/               # Multi-step user workflows
└── release/                     # Release/smoke tests
    └── critical-paths.test.ts   # Critical functionality tests
```

## Running Tests

### Run All Tests
```bash
npm test
# or
yarn test
```

### Run Tests in Watch Mode (Development)
```bash
npm test -- --watch
# or
yarn test --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage
# or
yarn test --coverage
```

### Run Specific Test File
```bash
npm test -- __tests__/unit/utils/strings.test.ts
# or
yarn test __tests__/unit/utils/strings.test.ts
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="capitalizeAllWords"
# or
yarn test --testNamePattern="capitalizeAllWords"
```

### Run Release Tests Only
```bash
npm test:release
# or
yarn test:release
```

## Test Coverage Goals

- **Utilities**: 100% coverage (pure functions, easy to test)
- **Services**: 100% coverage (API interactions, error handling)
- **State Management**: 100% coverage (business logic)
- **Components**: 80%+ coverage (UI components and user interactions)
- **Hooks**: 80%+ coverage (React hook logic)

## Current Test Statistics

- **Total Tests**: 331 tests across 10 test suites
- **Coverage**:
  - Low-level features (utils, services, store): 100% statements, 98%+ branches
  - UI components: 85+ tests covering core components
  - Integration tests: 30 tests covering critical user workflows

---

## Writing Resilient Tests (IMPORTANT!)

When adding new features to the app, you want tests that verify behavior **without breaking** when you make changes. Follow these principles to write **resilient, maintainable tests**:

### ✅ DO: Test Behavior, Not Implementation

```typescript
// ✅ GOOD - Tests what the function does
it('should capitalize each word', () => {
  expect(capitalizeAllWords('hello world')).toBe('Hello World');
});

// ❌ BAD - Tests how it's implemented
it('should use split and map', () => {
  const spy = jest.spyOn(String.prototype, 'split');
  capitalizeAllWords('hello world');
  expect(spy).toHaveBeenCalled();
});
```

### ✅ DO: Test Component Contracts (Props In, Events Out)

```typescript
// ✅ GOOD - Tests the interface
it('should call onPress when button is pressed', () => {
  const mockOnPress = jest.fn();
  const { getByText } = render(<Button onPress={mockOnPress}>Submit</Button>);
  fireEvent.press(getByText('Submit'));
  expect(mockOnPress).toHaveBeenCalled();
});

// ❌ BAD - Tests internal state or props
it('should have correct internal state', () => {
  const button = render(<Button>Submit</Button>);
  expect(button.instance().state.pressed).toBe(false);
});
```

### ✅ DO: Use Semantic Queries

```typescript
// ✅ GOOD - Finds elements like a user would
const button = getByText('Submit');
const input = getByLabelText('Email Address');
const heading = getByRole('heading');

// ❌ BAD - Relies on test IDs or implementation details
const button = container.querySelector('.button-class');
```

### ✅ DO: Test Edge Cases and Error Handling

```typescript
// ✅ GOOD - Tests edge cases
it('should handle empty string', () => {
  expect(capitalizeAllWords('')).toBe('');
});

it('should handle null gracefully', () => {
  expect(() => parseJSON(null)).toThrow('Invalid input');
});

// Also test: long inputs, special characters, boundary conditions
```

### ❌ DON'T: Test Styling Details

```typescript
// ❌ BAD - Breaks when you change colors/fonts
it('should have blue background', () => {
  const button = render(<Button />);
  expect(button.props.style.backgroundColor).toBe('#007AFF');
});

// ✅ GOOD - Test styling only if it's business logic
it('should be disabled when loading', () => {
  const { getByText } = render(<Button disabled>Submit</Button>);
  expect(getByText('Submit')).toBeDisabled();
});
```

### ❌ DON'T: Use Snapshot Tests (Usually)

```typescript
// ❌ BAD - Brittle, breaks with any change
it('should match snapshot', () => {
  const tree = renderer.create(<MyComponent />).toJSON();
  expect(tree).toMatchSnapshot();
});

// ✅ GOOD - Test specific, intentional behavior
it('should render name and description', () => {
  const { getByText } = render(<MyComponent name="Test" description="Desc" />);
  expect(getByText('Test')).toBeTruthy();
  expect(getByText('Desc')).toBeTruthy();
});
```

### ✅ DO: Use Test Helpers for Common Data

```typescript
// ✅ GOOD - Use helpers from __tests__/test-helpers/index.ts
import { createMockWeatherData, createMockOutfit } from '@/__tests__/test-helpers';

it('should handle weather data', () => {
  const weather = createMockWeatherData({
    current: { temp: 85 }
  });
  const result = processWeather(weather);
  expect(result.isHot).toBe(true);
});
```

### ✅ DO: Mock External Dependencies, Not Internal Logic

```typescript
// ✅ GOOD - Mock external APIs
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// ❌ BAD - Mock internal functions of the module you're testing
jest.mock('@/utils/strings', () => ({
  capitalizeAllWords: jest.fn(),
}));
```

### Why These Practices Matter

When you follow these practices:
- ✅ **Add new props** → Tests still pass
- ✅ **Change styling** → Tests still pass
- ✅ **Refactor internals** → Tests still pass
- ✅ **Add features** → Old tests don't break
- ✅ **Change theme** → Tests still pass

The tests verify **what users care about** (does it work?) not **how it's built** (implementation details).

---

## Writing Tests - Examples

### Unit Test Example

```typescript
import { capitalizeAllWords } from '@/utils/strings';

describe('capitalizeAllWords', () => {
  it('should capitalize each word in a sentence', () => {
    expect(capitalizeAllWords('hello world')).toBe('Hello World');
  });

  it('should handle empty strings', () => {
    expect(capitalizeAllWords('')).toBe('');
  });

  it('should handle edge cases', () => {
    expect(capitalizeAllWords('  multiple   spaces  ')).toBe('  Multiple   Spaces  ');
  });
});
```

### Service Test Example (with Mocking)

```typescript
import axios from 'axios';
import { fetchWeatherData } from '@/services/openweathermap-service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchWeatherData', () => {
  it('should fetch weather data successfully', async () => {
    const mockData = { /* mock weather data */ };
    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await fetchWeatherData(40.7128, -74.0060);

    expect(result.data).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('api.openweathermap.org')
    );
  });
});
```

### Component Test Example

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemedButton } from '@/components/ui/button';

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: () => '#007AFF',
}));

describe('ThemedButton', () => {
  it('should call onPress when pressed', () => {
    // Arrange
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <ThemedButton onPress={mockOnPress}>Submit</ThemedButton>
    );

    // Act
    fireEvent.press(getByText('Submit'));

    // Assert
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    // Arrange
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <ThemedButton onPress={mockOnPress} disabled>
        Submit
      </ThemedButton>
    );

    // Act
    fireEvent.press(getByText('Submit'));

    // Assert
    expect(mockOnPress).not.toHaveBeenCalled();
  });
});
```

### State Management Test Example

```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useStore } from '@/store/store';

describe('useStore', () => {
  it('should update style preference', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.setStyle('casual');
    });

    expect(result.current.style).toBe('casual');
  });
});
```

### Using Test Helpers

```typescript
import { createMockWeatherData, createMockOutfit } from '@/__tests__/test-helpers';

describe('buildOutfitPrompt', () => {
  it('should include weather data in prompt', () => {
    // Arrange - Use helper to create mock data
    const weather = createMockWeatherData({
      current: { temp: 75 }
    });
    const userPrefs = { style: 'casual', activity: 'walking' };

    // Act
    const prompt = buildOutfitPrompt(userPrefs, weather, 'imperial');

    // Assert
    expect(prompt).toContain('75°F');
    expect(prompt).toContain('walking');
  });
});
```

## Best Practices

### 1. Test Independence
- Each test must be executable on its own
- Use `beforeEach` and `afterEach` to reset state
- Clear mocks between tests: `jest.clearAllMocks()`

### 2. AAA Pattern (Arrange-Act-Assert)
```typescript
it('should do something', () => {
  // Arrange - set up test data
  const input = 'test data';

  // Act - execute the function
  const result = myFunction(input);

  // Assert - verify the result
  expect(result).toBe('expected output');
});
```

### 3. Descriptive Test Names
- Use "should" statements: `it('should return empty string for null input')`
- Be specific: `it('should throw error when API key is missing')`

### 4. Test Edge Cases
- Empty inputs
- Null/undefined values
- Boundary conditions
- Error scenarios

### 5. Mock External Dependencies
- API calls
- AsyncStorage
- Location services
- Third-party libraries

### 6. Keep Tests Fast
- Unit tests should run in milliseconds
- Mock heavy operations
- Avoid real network calls

## Common Testing Utilities

### Test Helpers Available

Import from `@/__tests__/test-helpers`:

- `createMockWeatherData(overrides?)` - Create complete mock weather data
- `createMockClothingItem(overrides?)` - Create mock clothing item
- `createMockOutfit(overrides?)` - Create complete mock outfit
- `createMinimalWeatherData()` - Create minimal weather data (for testing error handling)
- `waitForAsync(ms?)` - Wait for async operations
- `setupMockEnv(vars)` - Set up mock environment variables
- `cleanupMockEnv(keys)` - Clean up environment variables
- `createMockAxiosResponse(data)` - Create mock axios response
- `createMockAxiosError(message, code?, statusCode?)` - Create mock axios error

### Mocking AsyncStorage
```typescript
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));
```

### Mocking Axios
```typescript
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
```

### Testing Async Functions
```typescript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

### Testing Error Handling
```typescript
it('should throw error for invalid input', () => {
  expect(() => myFunction(null)).toThrow('Invalid input');
});
```

## Continuous Integration

Tests should be run:
- Before every commit (pre-commit hook)
- On every pull request
- Before deployment
- On scheduled intervals (nightly builds)

### Pre-commit Hook Example
Add to `.git/hooks/pre-commit`:
```bash
#!/bin/sh
npm test -- --bail --findRelatedTests
```

## Debugging Tests

### Run Single Test in Debug Mode
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### View Test Output
```bash
npm test -- --verbose
```

### Update Snapshots (if used)
```bash
npm test -- --updateSnapshot
```

## Release Testing

Before each release, run the release test suite:
```bash
npm test:release
# or
yarn test:release
```

These tests verify:
- Critical user paths work end-to-end
- API integrations are functional
- Data persistence works correctly
- Error handling is robust

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Expo Testing Guide](https://docs.expo.dev/develop/unit-testing/)

## Troubleshooting

### Tests Failing After Package Update
```bash
# Clear Jest cache
npx jest --clearCache

# Reinstall dependencies
rm -rf node_modules
yarn install
```

### AsyncStorage Errors
Ensure AsyncStorage is properly mocked in `jest.setup.js`

### Module Resolution Errors
Check `tsconfig.json` paths and `jest.config.js` moduleNameMapper

## Contributing

When adding new features:
1. Write tests first (TDD approach recommended)
2. Follow resilient testing practices (see above)
3. Use test helpers from `__tests__/test-helpers` for mock data
4. Ensure tests pass: `npm test`
5. Check coverage: `npm test -- --coverage`
6. Aim for >80% coverage on new code
7. Update this documentation if needed

---

**Remember**: Good tests verify behavior, not implementation. They should give you confidence to refactor and add features without breaking existing functionality.

Last Updated: 2025-11-15
