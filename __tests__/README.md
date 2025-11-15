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
├── unit/                        # Unit tests for individual modules
│   ├── utils/                   # Tests for utility functions
│   ├── services/                # Tests for API services
│   ├── store/                   # Tests for state management
│   └── hooks/                   # Tests for custom hooks
├── integration/                 # Integration tests
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

## Test Coverage Goals

- **Utilities**: 100% coverage (pure functions, easy to test)
- **Services**: 90%+ coverage (API interactions, error handling)
- **State Management**: 90%+ coverage (business logic)
- **Hooks**: 80%+ coverage (React hook logic)
- **Components**: 70%+ coverage (user interactions)

## Writing Tests

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

### Update Snapshots
```bash
npm test -- --updateSnapshot
```

## Release Testing

Before each release, run the release test suite:
```bash
npm test -- __tests__/release/
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
2. Ensure tests pass: `npm test`
3. Check coverage: `npm test -- --coverage`
4. Aim for >80% coverage on new code
5. Update this documentation if needed

---

Last Updated: 2025-11-15
