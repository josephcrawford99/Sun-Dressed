import React from 'react';
import { render } from '@testing-library/react-native';
import ClothingSuggestions from '../components/ClothingSuggestions';
import { mockSunnyClothing } from '../__mocks__/clothingData';
import { ThemeProvider } from '../utils/ThemeContext';

// Mock the Ionicons component
jest.mock('@expo/vector-icons', () => {
  return {
    Ionicons: ({ name, size, color }) => `Icon: ${name}`,
  };
});

describe('ClothingSuggestions Component', () => {
  it('renders correctly with clothing suggestions', () => {
    const { getByText, queryByText } = render(
      <ThemeProvider>
        <ClothingSuggestions suggestions={mockSunnyClothing} />
      </ThemeProvider>
    );

    // Check section titles
    expect(getByText('What to Wear')).toBeTruthy();
    expect(getByText('Tops')).toBeTruthy();
    expect(getByText('Bottoms')).toBeTruthy();
    expect(getByText('Footwear')).toBeTruthy();

    // Check specific clothing items
    expect(getByText('T-Shirt')).toBeTruthy();
    expect(getByText('A lightweight, breathable cotton tee')).toBeTruthy();
    expect(getByText('Shorts')).toBeTruthy();
    expect(getByText('Light cotton or linen shorts')).toBeTruthy();
    expect(getByText('Sandals')).toBeTruthy();

    // Accessories
    expect(getByText('Accessories')).toBeTruthy();
    expect(getByText('Sunglasses')).toBeTruthy();
    expect(getByText('Hat')).toBeTruthy();

    // No outer layers for sunny weather
    expect(queryByText('Outer Layers')).toBeNull();
  });
});
