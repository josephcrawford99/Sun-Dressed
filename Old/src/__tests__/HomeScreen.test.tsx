import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';

// Mock the navigation
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

// Mock LinearGradient
jest.mock('expo-linear-gradient', () => {
  return {
    LinearGradient: ({ children }) => children,
  };
});

// Mock Ionicons
jest.mock('@expo/vector-icons', () => {
  return {
    Ionicons: ({ name, size, color }) => `Icon: ${name}`,
  };
});

// Mock components
jest.mock('../components/WeatherDisplay', () => {
  return {
    __esModule: true,
    default: ({ weatherData }) => `Weather Display: ${weatherData.description}`,
  };
});

jest.mock('../components/ClothingSuggestions', () => {
  return {
    __esModule: true,
    default: ({ suggestions }) => `Clothing Suggestions`,
  };
});

// Mock services
jest.mock('../services/clothingService', () => {
  return {
    getSuggestions: jest.fn(() => ({
      tops: [],
      bottoms: [],
      outerLayers: [],
      accessories: [],
      footwear: [],
    })),
  };
});

describe('HomeScreen Component', () => {
  it('renders without crashing', () => {
    const { getByText, queryByText } = render(<HomeScreen />);

    // Should render without crashing and show components
    expect(queryByText(/Weather Display/)).toBeTruthy();
    expect(queryByText(/Clothing Suggestions/)).toBeTruthy();
  });
});
