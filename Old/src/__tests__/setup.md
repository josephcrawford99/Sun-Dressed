# Testing Instructions

## Running Tests
To run the test suite on your local machine:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode during development
npm test -- --watch
```

## Test Emulator Setup
To test the UI on mobile emulators:

### Android Emulator
1. Install Android Studio and create an Android Virtual Device (AVD)
2. Start your emulator either through Android Studio or command line
3. Run: `npm run android`

### iOS Simulator (macOS only)
1. Install Xcode from the Mac App Store
2. Open Xcode and set up a simulator device
3. Run: `npm run ios`

## Test Scenarios
When testing the app manually, try these scenarios:

1. **Weather Toggling**: In the development build, you can test different weather conditions using the weather toggle buttons at the top of the screen
2. **UI Adaptation**: Verify the UI theme changes appropriately with different weather conditions
3. **Responsive Layout**: Test on different device sizes to ensure responsive design
4. **Component Testing**: Verify each clothing category displays correctly with its respective items
