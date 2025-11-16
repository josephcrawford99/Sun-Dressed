module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'node',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|zustand)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'utils/**/*.{ts,tsx}',
    'services/**/*.{ts,tsx}',
    'store/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    './utils/**/*.{ts,tsx}': {
      branches: 80,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    './services/**/*.{ts,tsx}': {
      branches: 95,
      functions: 100,
      lines: 100,
      statements: 100,
    },
    './store/**/*.{ts,tsx}': {
      branches: 95,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testMatch: [
    '**/__tests__/**/*.test.{ts,tsx}',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react',
      },
    },
  },
};
