/**
 * Test Helpers - Utilities for consistent test setup and assertions
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        {children}
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Custom matchers for common assertions
export const expectToBeVisible = (element: any) => {
  expect(element).toBeTruthy();
  expect(element).toBeOnTheScreen();
};

export const expectToBeHidden = (element: any) => {
  expect(element).toBeFalsy();
};

// Date utilities for consistent test dates
export const createTestDate = (daysFromNow: number = 0): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

export const formatTestDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

// Mock function factories
export const createMockAsyncStorage = () => {
  const storage = new Map<string, string>();
  
  return {
    getItem: jest.fn((key: string) => Promise.resolve(storage.get(key) || null)),
    setItem: jest.fn((key: string, value: string) => {
      storage.set(key, value);
      return Promise.resolve();
    }),
    removeItem: jest.fn((key: string) => {
      storage.delete(key);
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      storage.clear();
      return Promise.resolve();
    }),
    getAllKeys: jest.fn(() => Promise.resolve(Array.from(storage.keys()))),
    __getStorage: () => storage,
  };
};

export const createMockAxios = () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(() => createMockAxios()),
});

// Component test utilities
export const fireEventAndWait = async (
  fireEventFn: () => void,
  waitForFn: () => Promise<any>
) => {
  fireEventFn();
  await waitForFn();
};

// Error boundary for testing error states
export class TestErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return null; // or error UI
    }

    return this.props.children;
  }
}

// Async test utilities
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

export const advanceTimersByTime = (ms: number) => {
  jest.advanceTimersByTime(ms);
};

// API mock utilities
export const mockApiSuccess = <T>(data: T) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
});

export const mockApiError = (message: string, code: number = 500) => ({
  response: {
    data: { message },
    status: code,
    statusText: 'Error',
    headers: {},
    config: {},
  },
  message,
  code,
});