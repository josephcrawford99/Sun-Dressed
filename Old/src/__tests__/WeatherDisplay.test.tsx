import React from 'react';
import { render } from '@testing-library/react-native';
import WeatherDisplay from '../components/WeatherDisplay';
import { mockSunnyWeather } from '../__mocks__/weatherData';
import { ThemeProvider } from '../utils/ThemeContext';

// Mock the LinearGradient component
jest.mock('expo-linear-gradient', () => {
  return {
    LinearGradient: ({ children }) => children,
  };
});

// Mock weather icon URL
jest.mock('../utils/weatherUtils', () => {
  return {
    getWeatherIconUrl: jest.fn(() => 'https://example.com/weather-icon.png'),
  };
});

describe('WeatherDisplay Component', () => {
  it('renders correctly with weather data', () => {
    const { getByText } = render(
      <ThemeProvider>
        <WeatherDisplay weatherData={mockSunnyWeather} />
      </ThemeProvider>
    );

    // Check that key weather data is displayed
    expect(getByText('clear sky')).toBeTruthy();
    expect(getByText('This Afternoon')).toBeTruthy();
    expect(getByText('25°C')).toBeTruthy();
    expect(getByText('Feels like 27°C')).toBeTruthy();
    expect(getByText('40%')).toBeTruthy(); // Humidity
    expect(getByText('3.5 m/s')).toBeTruthy(); // Wind speed
  });
});
