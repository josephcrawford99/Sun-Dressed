// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock Expo linear gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }) => children,
}));

// Mock Expo icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name, size, color }) => `Icon-${name}`,
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    })),
    useRoute: jest.fn(() => ({})),
    useIsFocused: jest.fn(() => true),
  };
});

// Mock dimensions for consistent UI testing
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Suppress lifecycle method warnings
jest.spyOn(console, 'warn').mockImplementation((message) => {
  if (message.includes('componentWillReceiveProps') ||
      message.includes('componentWillUpdate') ||
      message.includes('componentWillMount')) {
    return;
  }
  // eslint-disable-next-line no-console
  console.warn(message);
});
