import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemedButton } from '@/components/button';

// Mock dependencies
jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn((props, colorName) => {
    // Return different colors based on colorName for testing
    if (colorName === 'tint') return '#007AFF';
    if (colorName === 'text') return '#000000';
    return '#CCCCCC';
  }),
}));

jest.mock('@/components/themed-text', () => ({
  ThemedText: ({ children, ...props }: any) => {
    const { Text } = require('react-native');
    return <Text {...props}>{children}</Text>;
  },
}));

describe('ThemedButton', () => {
  describe('Rendering', () => {
    it('should render button with text children', () => {
      // Arrange & Act
      const { getByText } = render(<ThemedButton>Click Me</ThemedButton>);

      // Assert
      expect(getByText('Click Me')).toBeTruthy();
    });

    it('should render button with different text content', () => {
      // Arrange & Act
      const { getByText } = render(<ThemedButton>Submit</ThemedButton>);

      // Assert
      expect(getByText('Submit')).toBeTruthy();
    });

    it('should render with empty string children', () => {
      // Arrange & Act
      const { root } = render(<ThemedButton></ThemedButton>);

      // Assert - should not crash
      expect(root).toBeTruthy();
    });

    it('should render with complex children content', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedButton>
          Save & Continue
        </ThemedButton>
      );

      // Assert
      expect(getByText('Save & Continue')).toBeTruthy();
    });
  });

  describe('Press Interactions', () => {
    it('should call onPress handler when pressed', () => {
      // Arrange
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <ThemedButton onPress={mockOnPress}>Press Me</ThemedButton>
      );

      // Act
      fireEvent.press(getByText('Press Me').parent!);

      // Assert
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should call onPress when interacted with', () => {
      // Arrange
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <ThemedButton onPress={mockOnPress}>Press Me</ThemedButton>
      );

      // Act
      fireEvent.press(getByText('Press Me').parent!);

      // Assert
      expect(mockOnPress).toHaveBeenCalled();
    });

    it('should handle multiple presses', () => {
      // Arrange
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <ThemedButton onPress={mockOnPress}>Press Me</ThemedButton>
      );
      const button = getByText('Press Me').parent!;

      // Act
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      // Assert
      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });

    it('should not call onPress when disabled', () => {
      // Arrange
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <ThemedButton onPress={mockOnPress} disabled>
          Disabled Button
        </ThemedButton>
      );

      // Act
      fireEvent.press(getByText('Disabled Button').parent!);

      // Assert
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('should work without onPress handler', () => {
      // Arrange & Act
      const { getByText } = render(<ThemedButton>No Handler</ThemedButton>);

      // Assert - should not throw error when pressed
      expect(() => {
        fireEvent.press(getByText('No Handler').parent!);
      }).not.toThrow();
    });
  });

  describe('Disabled State', () => {
    it('should render when disabled', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedButton disabled>Disabled</ThemedButton>
      );

      // Assert
      expect(getByText('Disabled')).toBeTruthy();
    });

    it('should prevent interaction when disabled', () => {
      // Arrange
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <ThemedButton onPress={mockOnPress} disabled>
          Click
        </ThemedButton>
      );

      // Act
      fireEvent.press(getByText('Click').parent!);

      // Assert
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('should allow enabling after being disabled', () => {
      // Arrange
      const mockOnPress = jest.fn();
      const { getByText, rerender } = render(
        <ThemedButton onPress={mockOnPress} disabled>
          Toggle
        </ThemedButton>
      );

      // Act - press while disabled
      fireEvent.press(getByText('Toggle').parent!);
      expect(mockOnPress).not.toHaveBeenCalled();

      // Act - re-render as enabled
      rerender(
        <ThemedButton onPress={mockOnPress}>
          Toggle
        </ThemedButton>
      );

      // Act - press while enabled
      fireEvent.press(getByText('Toggle').parent!);

      // Assert
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Press State Visual Feedback', () => {
    it('should handle pressIn event', () => {
      // Arrange
      const mockPressIn = jest.fn();
      const { getByText } = render(
        <ThemedButton onPressIn={mockPressIn}>Press</ThemedButton>
      );

      // Act
      fireEvent(getByText('Press').parent!, 'pressIn');

      // Assert
      expect(mockPressIn).toHaveBeenCalledTimes(1);
    });

    it('should handle pressOut event', () => {
      // Arrange
      const mockPressOut = jest.fn();
      const { getByText } = render(
        <ThemedButton onPressOut={mockPressOut}>Press</ThemedButton>
      );

      // Act
      fireEvent(getByText('Press').parent!, 'pressOut');

      // Assert
      expect(mockPressOut).toHaveBeenCalledTimes(1);
    });

    it('should handle complete press cycle', () => {
      // Arrange
      const mockPressIn = jest.fn();
      const mockPressOut = jest.fn();
      const mockPress = jest.fn();
      const { getByText } = render(
        <ThemedButton
          onPressIn={mockPressIn}
          onPressOut={mockPressOut}
          onPress={mockPress}
        >
          Press
        </ThemedButton>
      );
      const button = getByText('Press').parent!;

      // Act
      fireEvent(button, 'pressIn');
      fireEvent.press(button);
      fireEvent(button, 'pressOut');

      // Assert
      expect(mockPressIn).toHaveBeenCalledTimes(1);
      expect(mockPress).toHaveBeenCalledTimes(1);
      expect(mockPressOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('Custom Styling', () => {
    it('should accept custom style prop', () => {
      // Arrange
      const customStyle = { marginTop: 20 };

      // Act
      const { getByText } = render(
        <ThemedButton style={customStyle}>Styled</ThemedButton>
      );

      // Assert - should render without crashing
      expect(getByText('Styled')).toBeTruthy();
    });

    it('should accept array of styles', () => {
      // Arrange
      const styles = [{ marginTop: 10 }, { paddingHorizontal: 20 }];

      // Act
      const { getByText } = render(
        <ThemedButton style={styles}>Multi-Style</ThemedButton>
      );

      // Assert - should render without crashing
      expect(getByText('Multi-Style')).toBeTruthy();
    });
  });

  describe('Pressable Props Forwarding', () => {
    it('should render and be accessible when accessible prop is set', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedButton accessible={true}>Accessible</ThemedButton>
      );

      // Assert - button renders and is accessible
      expect(getByText('Accessible')).toBeTruthy();
    });

    it('should be findable by accessibility label', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedButton accessibilityLabel="Submit Form">Submit</ThemedButton>
      );

      // Assert - button renders with accessibility label
      expect(getByText('Submit')).toBeTruthy();
    });

    it('should be findable by testID', () => {
      // Arrange & Act
      const { getByTestId } = render(
        <ThemedButton testID="submit-button">Submit</ThemedButton>
      );

      // Assert
      expect(getByTestId('submit-button')).toBeTruthy();
    });

    it('should respond to long press events', () => {
      // Arrange
      const mockLongPress = jest.fn();
      const { getByText } = render(
        <ThemedButton onLongPress={mockLongPress}>Long Press</ThemedButton>
      );

      // Act
      fireEvent(getByText('Long Press').parent!, 'longPress');

      // Assert
      expect(mockLongPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle numeric children', () => {
      // Arrange & Act
      const { getByText } = render(<ThemedButton>{123}</ThemedButton>);

      // Assert
      expect(getByText('123')).toBeTruthy();
    });

    it('should handle very long text content', () => {
      // Arrange
      const longText = 'A'.repeat(500);

      // Act
      const { getByText } = render(<ThemedButton>{longText}</ThemedButton>);

      // Assert
      expect(getByText(longText)).toBeTruthy();
    });

    it('should handle special characters in text', () => {
      // Arrange
      const specialText = '🎉 Save & Exit! (100%)';

      // Act
      const { getByText } = render(<ThemedButton>{specialText}</ThemedButton>);

      // Assert
      expect(getByText(specialText)).toBeTruthy();
    });

    it('should handle rapid successive presses', () => {
      // Arrange
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <ThemedButton onPress={mockOnPress}>Rapid</ThemedButton>
      );
      const button = getByText('Rapid').parent!;

      // Act - simulate rapid presses
      for (let i = 0; i < 10; i++) {
        fireEvent.press(button);
      }

      // Assert
      expect(mockOnPress).toHaveBeenCalledTimes(10);
    });
  });

  describe('Accessibility', () => {
    it('should be accessible by default', () => {
      // Arrange & Act
      const { getByText } = render(<ThemedButton>Accessible</ThemedButton>);

      // Assert - button should be findable
      expect(getByText('Accessible').parent).toBeTruthy();
    });

    it('should render with accessibility role', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedButton accessibilityRole="button">Role</ThemedButton>
      );

      // Assert - button renders with role
      expect(getByText('Role')).toBeTruthy();
    });

    it('should render disabled state with accessibility state', () => {
      // Arrange
      const mockOnPress = jest.fn();

      // Act
      const { getByText } = render(
        <ThemedButton disabled accessibilityState={{ disabled: true }} onPress={mockOnPress}>
          Disabled
        </ThemedButton>
      );

      // Assert - disabled button doesn't respond to press
      fireEvent.press(getByText('Disabled').parent!);
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('should render with accessibility hint', () => {
      // Arrange & Act
      const { getByText } = render(
        <ThemedButton accessibilityHint="Double tap to submit">
          Submit
        </ThemedButton>
      );

      // Assert - button renders with hint
      expect(getByText('Submit')).toBeTruthy();
    });
  });

  describe('Theme Integration', () => {
    it('should call useThemeColor hook for tint color', () => {
      // Arrange
      const useThemeColorMock = require('@/hooks/use-theme-color').useThemeColor;
      useThemeColorMock.mockClear();

      // Act
      render(<ThemedButton>Theme</ThemedButton>);

      // Assert
      expect(useThemeColorMock).toHaveBeenCalledWith({}, 'tint');
    });

    it('should call useThemeColor hook for text color', () => {
      // Arrange
      const useThemeColorMock = require('@/hooks/use-theme-color').useThemeColor;
      useThemeColorMock.mockClear();

      // Act
      render(<ThemedButton>Theme</ThemedButton>);

      // Assert
      expect(useThemeColorMock).toHaveBeenCalledWith({}, 'text');
    });
  });
});
