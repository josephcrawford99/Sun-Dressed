import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { OutfitItemCard } from '@/components/outfit-item-card';

// Mock dependencies
jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn(() => '#000000'),
}));

jest.mock('@/components/themed-text', () => ({
  ThemedText: ({ children, ...props }: any) => {
    const { Text } = require('react-native');
    return <Text {...props}>{children}</Text>;
  },
}));

jest.mock('@/components/ui/card', () => ({
  ThemedCard: ({ children, ...props }: any) => {
    const { View } = require('react-native');
    return <View {...props}>{children}</View>;
  },
}));

jest.mock('@/components/ui/chevron', () => ({
  Chevron: ({ isCollapsed }: any) => {
    const { Text } = require('react-native');
    return <Text testID="chevron">{isCollapsed ? 'collapsed' : 'expanded'}</Text>;
  },
}));

describe('OutfitItemCard', () => {
  const defaultProps = {
    name: 'Blue T-Shirt',
    description: 'Comfortable cotton t-shirt',
    blurb: 'Perfect for sunny days',
  };

  describe('Rendering', () => {
    it('should render the component with all required props', () => {
      // Arrange & Act
      const { getByText } = render(<OutfitItemCard {...defaultProps} />);

      // Assert
      expect(getByText('Blue T-Shirt')).toBeTruthy();
      expect(getByText('Comfortable cotton t-shirt')).toBeTruthy();
    });

    it('should render with different name values', () => {
      // Arrange
      const props = { ...defaultProps, name: 'Red Jacket' };

      // Act
      const { getByText } = render(<OutfitItemCard {...props} />);

      // Assert
      expect(getByText('Red Jacket')).toBeTruthy();
    });

    it('should render with different description values', () => {
      // Arrange
      const props = { ...defaultProps, description: 'Warm winter jacket' };

      // Act
      const { getByText } = render(<OutfitItemCard {...props} />);

      // Assert
      expect(getByText('Warm winter jacket')).toBeTruthy();
    });

    it('should render with empty strings', () => {
      // Arrange
      const props = {
        name: '',
        description: '',
        blurb: '',
      };

      // Act
      const { root } = render(<OutfitItemCard {...props} />);

      // Assert - should not throw error
      expect(root).toBeTruthy();
    });
  });

  describe('Collapse/Expand Behavior', () => {
    it('should initially render in collapsed state', () => {
      // Arrange & Act
      const { queryByText, getByTestId } = render(<OutfitItemCard {...defaultProps} />);

      // Assert - blurb should not be visible
      expect(queryByText('Perfect for sunny days')).toBeNull();
      expect(getByTestId('chevron')).toHaveTextContent('collapsed');
    });

    it('should expand and show blurb when pressed', () => {
      // Arrange
      const { getByText, getByTestId } = render(<OutfitItemCard {...defaultProps} />);
      const pressable = getByText('Blue T-Shirt').parent?.parent;

      // Act
      fireEvent.press(pressable!);

      // Assert - blurb should now be visible
      expect(getByText('Perfect for sunny days')).toBeTruthy();
      expect(getByTestId('chevron')).toHaveTextContent('expanded');
    });

    it('should collapse again when pressed a second time', () => {
      // Arrange
      const { getByText, queryByText, getByTestId } = render(<OutfitItemCard {...defaultProps} />);
      const pressable = getByText('Blue T-Shirt').parent?.parent;

      // Act - expand then collapse
      fireEvent.press(pressable!);
      fireEvent.press(pressable!);

      // Assert - blurb should be hidden again
      expect(queryByText('Perfect for sunny days')).toBeNull();
      expect(getByTestId('chevron')).toHaveTextContent('collapsed');
    });

    it('should toggle multiple times correctly', () => {
      // Arrange
      const { getByText, queryByText, getByTestId } = render(<OutfitItemCard {...defaultProps} />);
      const pressable = getByText('Blue T-Shirt').parent?.parent;

      // Act & Assert - multiple toggles
      fireEvent.press(pressable!);
      expect(getByText('Perfect for sunny days')).toBeTruthy();
      expect(getByTestId('chevron')).toHaveTextContent('expanded');

      fireEvent.press(pressable!);
      expect(queryByText('Perfect for sunny days')).toBeNull();
      expect(getByTestId('chevron')).toHaveTextContent('collapsed');

      fireEvent.press(pressable!);
      expect(getByText('Perfect for sunny days')).toBeTruthy();
      expect(getByTestId('chevron')).toHaveTextContent('expanded');
    });
  });

  describe('Content Visibility', () => {
    it('should always show name regardless of collapse state', () => {
      // Arrange
      const { getByText } = render(<OutfitItemCard {...defaultProps} />);
      const pressable = getByText('Blue T-Shirt').parent?.parent;

      // Act & Assert - name visible when collapsed
      expect(getByText('Blue T-Shirt')).toBeTruthy();

      // Act - expand
      fireEvent.press(pressable!);

      // Assert - name still visible when expanded
      expect(getByText('Blue T-Shirt')).toBeTruthy();
    });

    it('should always show description regardless of collapse state', () => {
      // Arrange
      const { getByText } = render(<OutfitItemCard {...defaultProps} />);
      const pressable = getByText('Blue T-Shirt').parent?.parent;

      // Act & Assert - description visible when collapsed
      expect(getByText('Comfortable cotton t-shirt')).toBeTruthy();

      // Act - expand
      fireEvent.press(pressable!);

      // Assert - description still visible when expanded
      expect(getByText('Comfortable cotton t-shirt')).toBeTruthy();
    });

    it('should only show blurb when expanded', () => {
      // Arrange
      const { getByText, queryByText } = render(<OutfitItemCard {...defaultProps} />);
      const pressable = getByText('Blue T-Shirt').parent?.parent;

      // Assert - blurb not visible when collapsed
      expect(queryByText('Perfect for sunny days')).toBeNull();

      // Act - expand
      fireEvent.press(pressable!);

      // Assert - blurb visible when expanded
      expect(getByText('Perfect for sunny days')).toBeTruthy();
    });
  });

  describe('Component Integration', () => {
    it('should wrap content in ThemedCard component', () => {
      // Arrange & Act
      const { getByText } = render(<OutfitItemCard {...defaultProps} />);

      // Assert - content should be rendered within the card structure
      expect(getByText('Blue T-Shirt')).toBeTruthy();
      expect(getByText('Comfortable cotton t-shirt')).toBeTruthy();
    });

    it('should pass correct isCollapsed state to Chevron component', () => {
      // Arrange
      const { getByText, getByTestId } = render(<OutfitItemCard {...defaultProps} />);
      const pressable = getByText('Blue T-Shirt').parent?.parent;

      // Assert - initially collapsed
      expect(getByTestId('chevron')).toHaveTextContent('collapsed');

      // Act - expand
      fireEvent.press(pressable!);

      // Assert - now expanded
      expect(getByTestId('chevron')).toHaveTextContent('expanded');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long names', () => {
      // Arrange
      const longName = 'A'.repeat(200);
      const props = { ...defaultProps, name: longName };

      // Act
      const { getByText } = render(<OutfitItemCard {...props} />);

      // Assert - should render without crashing
      expect(getByText(longName)).toBeTruthy();
    });

    it('should handle very long descriptions', () => {
      // Arrange
      const longDescription = 'B'.repeat(500);
      const props = { ...defaultProps, description: longDescription };

      // Act
      const { getByText } = render(<OutfitItemCard {...props} />);

      // Assert - should render without crashing
      expect(getByText(longDescription)).toBeTruthy();
    });

    it('should handle very long blurbs', () => {
      // Arrange
      const longBlurb = 'C'.repeat(500);
      const props = { ...defaultProps, blurb: longBlurb };

      // Act
      const { getByText } = render(<OutfitItemCard {...props} />);
      const pressable = getByText(props.name).parent?.parent;
      fireEvent.press(pressable!);

      // Assert - should render without crashing when expanded
      expect(getByText(longBlurb)).toBeTruthy();
    });

    it('should handle special characters in props', () => {
      // Arrange
      const props = {
        name: '🌞 Summer Outfit 2024 & More!',
        description: 'Cotton <fabric> with "quotes"',
        blurb: "It's a great day! 100% cotton.",
      };

      // Act
      const { getByText } = render(<OutfitItemCard {...props} />);

      // Assert - should render special characters correctly
      expect(getByText(props.name)).toBeTruthy();
      expect(getByText(props.description)).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should be pressable for keyboard and screen reader users', () => {
      // Arrange
      const { getByText } = render(<OutfitItemCard {...defaultProps} />);
      const pressable = getByText('Blue T-Shirt').parent?.parent;

      // Act
      fireEvent.press(pressable!);

      // Assert - interaction should work (blurb appears)
      expect(getByText('Perfect for sunny days')).toBeTruthy();
    });

    it('should maintain consistent structure for assistive technologies', () => {
      // Arrange & Act
      const { getByText } = render(<OutfitItemCard {...defaultProps} />);

      // Assert - key elements are accessible
      expect(getByText('Blue T-Shirt')).toBeTruthy();
      expect(getByText('Comfortable cotton t-shirt')).toBeTruthy();
    });
  });
});
