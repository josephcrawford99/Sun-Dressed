import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemedCard } from '@/components/ui/card';

// Mock dependencies
jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn((props, colorName) => {
    // Return different colors based on colorName for testing
    const colorMap: { [key: string]: string } = {
      cardDefault: '#FFFFFF',
      cardDefaultBorder: '#CCCCCC',
      cardError: '#FFE5E5',
      cardErrorBorder: '#FF0000',
      cardInfo: '#E5F3FF',
      cardInfoBorder: '#0066CC',
      cardData: '#F0F0F0',
      cardDataBorder: '#666666',
      cardWarning: '#FFF4E5',
      cardWarningBorder: '#FF9900',
    };
    return colorMap[colorName] || '#000000';
  }),
}));

jest.mock('@/components/themed-view', () => ({
  ThemedView: ({ children, ...props }: any) => {
    const { View } = require('react-native');
    return <View {...props}>{children}</View>;
  },
}));

describe('ThemedCard', () => {
  describe('Rendering', () => {
    it('should render card with children', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedCard>
          <Text>Card Content</Text>
        </ThemedCard>
      );

      // Assert
      expect(getByText('Card Content')).toBeTruthy();
    });

    it('should render with multiple children', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedCard>
          <Text>First Child</Text>
          <Text>Second Child</Text>
          <Text>Third Child</Text>
        </ThemedCard>
      );

      // Assert
      expect(getByText('First Child')).toBeTruthy();
      expect(getByText('Second Child')).toBeTruthy();
      expect(getByText('Third Child')).toBeTruthy();
    });

    it('should render with complex nested children', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedCard>
          <Text>Title</Text>
          <Text>Description</Text>
        </ThemedCard>
      );

      // Assert
      expect(getByText('Title')).toBeTruthy();
      expect(getByText('Description')).toBeTruthy();
    });

    it('should render with empty children without crashing', () => {
      // Arrange & Act
      const { root } = render(<ThemedCard>{null}</ThemedCard>);

      // Assert - should not crash
      expect(root).toBeTruthy();
    });
  });

  describe('Variant Prop', () => {
    it('should render with default variant when no variant specified', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedCard>
          <Text>Default</Text>
        </ThemedCard>
      );

      // Assert
      expect(getByText('Default')).toBeTruthy();
    });

    it('should render with default variant explicitly', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedCard variant="default">
          <Text>Default Explicit</Text>
        </ThemedCard>
      );

      // Assert
      expect(getByText('Default Explicit')).toBeTruthy();
    });

    it('should render with error variant', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedCard variant="error">
          <Text>Error Message</Text>
        </ThemedCard>
      );

      // Assert
      expect(getByText('Error Message')).toBeTruthy();
    });

    it('should render with info variant', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedCard variant="info">
          <Text>Info Message</Text>
        </ThemedCard>
      );

      // Assert
      expect(getByText('Info Message')).toBeTruthy();
    });

    it('should render with data variant', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedCard variant="data">
          <Text>Data Display</Text>
        </ThemedCard>
      );

      // Assert
      expect(getByText('Data Display')).toBeTruthy();
    });

    it('should render with warning variant', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedCard variant="warning">
          <Text>Warning Message</Text>
        </ThemedCard>
      );

      // Assert
      expect(getByText('Warning Message')).toBeTruthy();
    });

    it('should support switching between variants', () => {
      // Arrange
      const { getByText, rerender } = render(
        <ThemedCard variant="default">
          <Text>Content</Text>
        </ThemedCard>
      );

      // Assert - default variant
      expect(getByText('Content')).toBeTruthy();

      // Act - switch to error variant
      rerender(
        <ThemedCard variant="error">
          <Text>Content</Text>
        </ThemedCard>
      );

      // Assert - error variant
      expect(getByText('Content')).toBeTruthy();

      // Act - switch to info variant
      rerender(
        <ThemedCard variant="info">
          <Text>Content</Text>
        </ThemedCard>
      );

      // Assert - info variant
      expect(getByText('Content')).toBeTruthy();
    });
  });

  describe('Custom Styling', () => {
    it('should accept custom style prop', () => {
      // Arrange
      const customStyle = { marginTop: 20 };

      // Act
      const { getByText } = render(
        <ThemedCard style={customStyle}>
          <Text>Styled</Text>
        </ThemedCard>
      );

      // Assert - should render without crashing
      expect(getByText('Styled')).toBeTruthy();
    });

    it('should accept array of styles', () => {
      // Arrange
      const styles = [{ marginTop: 10 }, { paddingHorizontal: 20 }];

      // Act
      const { getByText } = render(
        <ThemedCard style={styles}>
          <Text>Multi-Style</Text>
        </ThemedCard>
      );

      // Assert - should render without crashing
      expect(getByText('Multi-Style')).toBeTruthy();
    });

    it('should merge custom styles with variant styles', () => {
      // Arrange
      const customStyle = { borderRadius: 16 };

      // Act
      const { getByText } = render(
        <ThemedCard variant="error" style={customStyle}>
          <Text>Custom Error</Text>
        </ThemedCard>
      );

      // Assert - should render without crashing
      expect(getByText('Custom Error')).toBeTruthy();
    });
  });

  describe('ViewProps Forwarding', () => {
    it('should be findable by testID', () => {
      // Arrange & Act
      const { getByTestId } = render(
        <ThemedCard testID="custom-card">
          <Text>Test ID</Text>
        </ThemedCard>
      );

      // Assert
      expect(getByTestId('custom-card')).toBeTruthy();
    });

    it('should render with accessible prop', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedCard accessible={true}>
          <Text>Accessible</Text>
        </ThemedCard>
      );

      // Assert - card renders with content
      expect(getByText('Accessible')).toBeTruthy();
    });

    it('should render with accessibility label', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedCard accessibilityLabel="Weather Card">
          <Text>Weather</Text>
        </ThemedCard>
      );

      // Assert - card renders with content
      expect(getByText('Weather')).toBeTruthy();
    });

    it('should accept onLayout callback', () => {
      // Arrange
      const mockOnLayout = jest.fn();

      // Act
      const { getByText } = render(
        <ThemedCard onLayout={mockOnLayout}>
          <Text>Layout</Text>
        </ThemedCard>
      );

      // Assert - card renders with layout callback
      expect(getByText('Layout')).toBeTruthy();
    });
  });

  describe('Theme Integration', () => {
    it('should call useThemeColor for default variant colors', () => {
      // Arrange
      const useThemeColorMock = require('@/hooks/use-theme-color').useThemeColor;
      useThemeColorMock.mockClear();

      // Act
      render(
        <ThemedCard variant="default">
          <Text>Default</Text>
        </ThemedCard>
      );

      // Assert
      expect(useThemeColorMock).toHaveBeenCalledWith({}, 'cardDefault');
      expect(useThemeColorMock).toHaveBeenCalledWith({}, 'cardDefaultBorder');
    });

    it('should call useThemeColor for error variant colors', () => {
      // Arrange
      const useThemeColorMock = require('@/hooks/use-theme-color').useThemeColor;
      useThemeColorMock.mockClear();

      // Act
      render(
        <ThemedCard variant="error">
          <Text>Error</Text>
        </ThemedCard>
      );

      // Assert
      expect(useThemeColorMock).toHaveBeenCalledWith({}, 'cardError');
      expect(useThemeColorMock).toHaveBeenCalledWith({}, 'cardErrorBorder');
    });

    it('should call useThemeColor for info variant colors', () => {
      // Arrange
      const useThemeColorMock = require('@/hooks/use-theme-color').useThemeColor;
      useThemeColorMock.mockClear();

      // Act
      render(
        <ThemedCard variant="info">
          <Text>Info</Text>
        </ThemedCard>
      );

      // Assert
      expect(useThemeColorMock).toHaveBeenCalledWith({}, 'cardInfo');
      expect(useThemeColorMock).toHaveBeenCalledWith({}, 'cardInfoBorder');
    });

    it('should call useThemeColor for data variant colors', () => {
      // Arrange
      const useThemeColorMock = require('@/hooks/use-theme-color').useThemeColor;
      useThemeColorMock.mockClear();

      // Act
      render(
        <ThemedCard variant="data">
          <Text>Data</Text>
        </ThemedCard>
      );

      // Assert
      expect(useThemeColorMock).toHaveBeenCalledWith({}, 'cardData');
      expect(useThemeColorMock).toHaveBeenCalledWith({}, 'cardDataBorder');
    });

    it('should call useThemeColor for warning variant colors', () => {
      // Arrange
      const useThemeColorMock = require('@/hooks/use-theme-color').useThemeColor;
      useThemeColorMock.mockClear();

      // Act
      render(
        <ThemedCard variant="warning">
          <Text>Warning</Text>
        </ThemedCard>
      );

      // Assert
      expect(useThemeColorMock).toHaveBeenCalledWith({}, 'cardWarning');
      expect(useThemeColorMock).toHaveBeenCalledWith({}, 'cardWarningBorder');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long text content', () => {
      // Arrange
      const longText = 'A'.repeat(1000);

      // Act
      const { getByText } = render(
        <ThemedCard>
          <Text>{longText}</Text>
        </ThemedCard>
      );

      // Assert
      expect(getByText(longText)).toBeTruthy();
    });

    it('should handle special characters in children', () => {
      // Arrange
      const specialText = '🎉 Success! 100% Complete & Ready';

      // Act
      const { getByText } = render(
        <ThemedCard>
          <Text>{specialText}</Text>
        </ThemedCard>
      );

      // Assert
      expect(getByText(specialText)).toBeTruthy();
    });

    it('should handle deeply nested children', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedCard>
          <Text>
            Level 1
            <Text>
              Level 2
              <Text>Level 3</Text>
            </Text>
          </Text>
        </ThemedCard>
      );

      // Assert
      expect(getByText('Level 3')).toBeTruthy();
    });

    it('should handle numeric children', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedCard>
          <Text>{42}</Text>
        </ThemedCard>
      );

      // Assert
      expect(getByText('42')).toBeTruthy();
    });

    it('should handle boolean children gracefully', () => {
      // Arrange & Act
      const { root } = render(
        <ThemedCard>
          {true}
          {false}
        </ThemedCard>
      );

      // Assert - should not crash
      expect(root).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should render with accessibility role', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedCard accessibilityRole="summary">
          <Text>Summary</Text>
        </ThemedCard>
      );

      // Assert - card renders with role
      expect(getByText('Summary')).toBeTruthy();
    });

    it('should render with accessibility hint', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedCard accessibilityHint="Weather information card">
          <Text>Weather</Text>
        </ThemedCard>
      );

      // Assert - card renders with hint
      expect(getByText('Weather')).toBeTruthy();
    });

    it('should render with accessibility state', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedCard accessibilityState={{ selected: true }}>
          <Text>Selected</Text>
        </ThemedCard>
      );

      // Assert - card renders with state
      expect(getByText('Selected')).toBeTruthy();
    });
  });

  describe('Component Integration', () => {
    it('should work as a container for other components', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedCard>
          <Text>Title</Text>
          <Text>Subtitle</Text>
          <Text>Body text goes here</Text>
        </ThemedCard>
      );

      // Assert
      expect(getByText('Title')).toBeTruthy();
      expect(getByText('Subtitle')).toBeTruthy();
      expect(getByText('Body text goes here')).toBeTruthy();
    });

    it('should support conditional rendering of children', () => {
      // Arrange
      const showContent = true;

      // Act
      const { getByText, queryByText } = render(
        <ThemedCard>
          {showContent && <Text>Visible</Text>}
          {!showContent && <Text>Hidden</Text>}
        </ThemedCard>
      );

      // Assert
      expect(getByText('Visible')).toBeTruthy();
      expect(queryByText('Hidden')).toBeNull();
    });

    it('should render as a container component', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedCard>
          <Text>Content</Text>
        </ThemedCard>
      );

      // Assert - verify content is rendered within the card
      expect(getByText('Content')).toBeTruthy();
    });
  });

  describe('Different Variant Visual Distinctions', () => {
    it('should render all variants without errors', () => {
      // Arrange
      const variants: Array<'default' | 'error' | 'info' | 'data' | 'warning'> = [
        'default',
        'error',
        'info',
        'data',
        'warning',
      ];

      // Act & Assert
      variants.forEach((variant) => {
        const { getByText } = render(
          <ThemedCard variant={variant}>
            <Text>{variant}</Text>
          </ThemedCard>
        );
        expect(getByText(variant)).toBeTruthy();
      });
    });
  });
});
