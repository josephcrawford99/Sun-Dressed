# Testing Documentation for Sun Dressed

This directory contains all automated tests for the Sun Dressed application. We follow industry-standard testing practices using Jest and React Native Testing Library.

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode (Development)
```bash
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Specific Test File
```bash
npm test -- __tests__/unit/utils/strings.test.ts
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="capitalizeAllWords"
```

### Run Release Tests Only
```bash
npm test:release
```

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
