/**
 * Jest Configuration for Sun Dressed App
 * Enterprise React Native Testing Setup 2025
 */

module.exports = {
  preset: 'jest-expo',
  
  // Test environment
  testEnvironment: 'node',
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/test/utils/testSetup.ts',
    '@testing-library/jest-native/extend-expect',
  ],
  
  // Module mapping for path aliases
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Test file patterns
  testMatch: [
    '<rootDir>/test/**/*.test.{js,jsx,ts,tsx}',
  ],
  
  // Files to collect coverage from
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
    '!src/**/index.{js,ts}',
  ],
  
  // Coverage thresholds for enterprise quality
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Coverage reporters
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'clover',
  ],
  
  // Transform patterns
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { 
      presets: ['babel-preset-expo'],
      plugins: [
        ['module-resolver', {
          alias: {
            '@': './src',
          },
        }],
      ],
    }],
  },
  
  // Module file extensions
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
  ],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.expo/',
  ],
  
  // Transform ignore patterns for React Native modules
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation|expo-.*|@expo/.*)',
  ],
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks between tests
  restoreMocks: true,
  
  // Verbose output for debugging
  verbose: false,
  
  // Maximum number of concurrent workers
  maxWorkers: '50%',
  
  // Test timeout (30 seconds for integration tests)
  testTimeout: 30000,
  
  // Global variables
  globals: {
    __DEV__: true,
  },
};