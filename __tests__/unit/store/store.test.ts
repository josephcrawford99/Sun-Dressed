import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from '@/store/store';
import { OutfitStyle } from '@/types/outfit';
import { TempFormat } from '@/services/openweathermap-service';

// Mock AsyncStorage is already set up in jest.setup.js

describe('useStore', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Reset the store state by clearing it
    const { result } = renderHook(() => useStore);
    act(() => {
      result.current.getState().setStyle('neutral');
      result.current.getState().setActivity('');
      result.current.getState().setTempFormat('imperial');
    });
  });

  describe('Initial State', () => {
    it('should have default style as neutral', () => {
      // Arrange & Act
      const { result } = renderHook(() => useStore());

      // Assert
      expect(result.current.style).toBe('neutral');
    });

    it('should have default activity as empty string', () => {
      // Arrange & Act
      const { result } = renderHook(() => useStore());

      // Assert
      expect(result.current.activity).toBe('');
    });

    it('should have default tempFormat as imperial', () => {
      // Arrange & Act
      const { result } = renderHook(() => useStore());

      // Assert
      expect(result.current.tempFormat).toBe('imperial');
    });

    it('should have all required action methods', () => {
      // Arrange & Act
      const { result } = renderHook(() => useStore());

      // Assert
      expect(typeof result.current.setStyle).toBe('function');
      expect(typeof result.current.setActivity).toBe('function');
      expect(typeof result.current.setTempFormat).toBe('function');
    });
  });

  describe('setStyle Action', () => {
    it('should update style to masculine', () => {
      // Arrange
      const { result } = renderHook(() => useStore());

      // Act
      act(() => {
        result.current.setStyle('masculine');
      });

      // Assert
      expect(result.current.style).toBe('masculine');
    });

    it('should update style to feminine', () => {
      // Arrange
      const { result } = renderHook(() => useStore());

      // Act
      act(() => {
        result.current.setStyle('feminine');
      });

      // Assert
      expect(result.current.style).toBe('feminine');
    });

    it('should update style to neutral', () => {
      // Arrange
      const { result } = renderHook(() => useStore());

      // First set to a different style
      act(() => {
        result.current.setStyle('masculine');
      });

      // Act
      act(() => {
        result.current.setStyle('neutral');
      });

      // Assert
      expect(result.current.style).toBe('neutral');
    });

    it('should handle multiple style changes', () => {
      // Arrange
      const { result } = renderHook(() => useStore());

      // Act
      act(() => {
        result.current.setStyle('masculine');
      });
      expect(result.current.style).toBe('masculine');

      act(() => {
        result.current.setStyle('feminine');
      });
      expect(result.current.style).toBe('feminine');

      act(() => {
        result.current.setStyle('neutral');
      });

      // Assert
      expect(result.current.style).toBe('neutral');
    });

    it('should not affect other state values when updating style', () => {
      // Arrange
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.setActivity('running');
        result.current.setTempFormat('metric');
      });

      // Act
      act(() => {
        result.current.setStyle('feminine');
      });

      // Assert
      expect(result.current.style).toBe('feminine');
      expect(result.current.activity).toBe('running');
      expect(result.current.tempFormat).toBe('metric');
    });
  });

  describe('setActivity Action', () => {
    it('should update activity from empty string', () => {
      // Arrange
      const { result } = renderHook(() => useStore());

      // Act
      act(() => {
        result.current.setActivity('running');
      });

      // Assert
      expect(result.current.activity).toBe('running');
    });

    it('should update activity to a new value', () => {
      // Arrange
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.setActivity('running');
      });

      // Act
      act(() => {
        result.current.setActivity('hiking');
      });

      // Assert
      expect(result.current.activity).toBe('hiking');
    });

    it('should clear activity by setting to empty string', () => {
      // Arrange
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.setActivity('swimming');
      });

      // Act
      act(() => {
        result.current.setActivity('');
      });

      // Assert
      expect(result.current.activity).toBe('');
    });

    it('should handle multiple activity changes', () => {
      // Arrange
      const { result } = renderHook(() => useStore());

      // Act & Assert
      act(() => {
        result.current.setActivity('running');
      });
      expect(result.current.activity).toBe('running');

      act(() => {
        result.current.setActivity('cycling');
      });
      expect(result.current.activity).toBe('cycling');

      act(() => {
        result.current.setActivity('yoga');
      });
      expect(result.current.activity).toBe('yoga');
    });

    it('should not affect other state values when updating activity', () => {
      // Arrange
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.setStyle('masculine');
        result.current.setTempFormat('metric');
      });

      // Act
      act(() => {
        result.current.setActivity('tennis');
      });

      // Assert
      expect(result.current.activity).toBe('tennis');
      expect(result.current.style).toBe('masculine');
      expect(result.current.tempFormat).toBe('metric');
    });
  });

  describe('setTempFormat Action', () => {
    it('should update tempFormat to metric', () => {
      // Arrange
      const { result } = renderHook(() => useStore());

      // Act
      act(() => {
        result.current.setTempFormat('metric');
      });

      // Assert
      expect(result.current.tempFormat).toBe('metric');
    });

    it('should update tempFormat to imperial', () => {
      // Arrange
      const { result } = renderHook(() => useStore());

      // First set to metric
      act(() => {
        result.current.setTempFormat('metric');
      });

      // Act
      act(() => {
        result.current.setTempFormat('imperial');
      });

      // Assert
      expect(result.current.tempFormat).toBe('imperial');
    });

    it('should handle toggling between formats', () => {
      // Arrange
      const { result } = renderHook(() => useStore());

      // Act & Assert - Toggle multiple times
      act(() => {
        result.current.setTempFormat('metric');
      });
      expect(result.current.tempFormat).toBe('metric');

      act(() => {
        result.current.setTempFormat('imperial');
      });
      expect(result.current.tempFormat).toBe('imperial');

      act(() => {
        result.current.setTempFormat('metric');
      });
      expect(result.current.tempFormat).toBe('metric');
    });

    it('should not affect other state values when updating tempFormat', () => {
      // Arrange
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.setStyle('feminine');
        result.current.setActivity('jogging');
      });

      // Act
      act(() => {
        result.current.setTempFormat('metric');
      });

      // Assert
      expect(result.current.tempFormat).toBe('metric');
      expect(result.current.style).toBe('feminine');
      expect(result.current.activity).toBe('jogging');
    });
  });

  describe('Persistence - AsyncStorage Integration', () => {
    it('should persist style changes to AsyncStorage', async () => {
      // Arrange
      const { result } = renderHook(() => useStore());
      jest.clearAllMocks(); // Clear previous calls

      // Act
      act(() => {
        result.current.setStyle('masculine');
      });

      // Assert - Wait for AsyncStorage to be called
      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalled();
      });

      // Verify the storage key and that style is included in persisted data
      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const storageCall = calls.find(call => call[0] === 'sundressed-storage');

      expect(storageCall).toBeDefined();
      if (storageCall) {
        const storedData = JSON.parse(storageCall[1]);
        expect(storedData.state).toHaveProperty('style');
        // Check that style is persisted (value should be 'masculine')
        const latestCall = calls[calls.length - 1];
        const latestData = JSON.parse(latestCall[1]);
        expect(latestData.state.style).toBe('masculine');
      }
    });

    it('should persist tempFormat changes to AsyncStorage', async () => {
      // Arrange
      const { result } = renderHook(() => useStore());
      jest.clearAllMocks(); // Clear previous calls

      // Act
      act(() => {
        result.current.setTempFormat('metric');
      });

      // Assert
      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalled();
      });

      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const storageCall = calls.find(call => call[0] === 'sundressed-storage');

      expect(storageCall).toBeDefined();
      if (storageCall) {
        const storedData = JSON.parse(storageCall[1]);
        expect(storedData.state).toHaveProperty('tempFormat');
        // Check that tempFormat is persisted (value should be 'metric')
        const latestCall = calls[calls.length - 1];
        const latestData = JSON.parse(latestCall[1]);
        expect(latestData.state.tempFormat).toBe('metric');
      }
    });

    it('should NOT persist activity changes to AsyncStorage', async () => {
      // Arrange
      const { result } = renderHook(() => useStore());
      jest.clearAllMocks(); // Clear any previous calls

      // Act
      act(() => {
        result.current.setActivity('running');
      });

      // Assert - AsyncStorage should not be called for activity-only changes
      // Give it a moment to see if it gets called
      await new Promise(resolve => setTimeout(resolve, 100));

      // If setItem was called, verify activity is not in the persisted data
      if ((AsyncStorage.setItem as jest.Mock).mock.calls.length > 0) {
        const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
        const storageCall = calls.find(call => call[0] === 'sundressed-storage');

        if (storageCall) {
          const storedData = JSON.parse(storageCall[1]);
          // Activity should not be in persisted state
          expect(storedData.state.activity).toBeUndefined();
        }
      }
    });

    it('should use correct storage key name', async () => {
      // Arrange
      const { result } = renderHook(() => useStore());

      // Act
      act(() => {
        result.current.setStyle('feminine');
      });

      // Assert
      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          'sundressed-storage',
          expect.any(String)
        );
      });
    });

    it('should persist multiple state changes correctly', async () => {
      // Arrange
      const { result } = renderHook(() => useStore());

      // Act
      act(() => {
        result.current.setStyle('feminine');
        result.current.setTempFormat('metric');
        result.current.setActivity('swimming'); // Should not be persisted
      });

      // Assert
      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalled();
      });

      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const storageCall = calls[calls.length - 1]; // Get the last call

      expect(storageCall[0]).toBe('sundressed-storage');
      const storedData = JSON.parse(storageCall[1]);

      // Should persist style and tempFormat
      expect(storedData.state.style).toBe('feminine');
      expect(storedData.state.tempFormat).toBe('metric');

      // Should NOT persist activity
      expect(storedData.state.activity).toBeUndefined();
    });

    it('should only persist partialize fields (style and tempFormat)', async () => {
      // Arrange
      const { result } = renderHook(() => useStore());

      // Act - Update all fields
      act(() => {
        result.current.setStyle('masculine');
        result.current.setTempFormat('metric');
        result.current.setActivity('basketball');
      });

      // Assert
      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalled();
      });

      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const storageCall = calls[calls.length - 1];
      const storedData = JSON.parse(storageCall[1]);

      // Check that only partialize fields are present
      const stateKeys = Object.keys(storedData.state);
      expect(stateKeys).toContain('style');
      expect(stateKeys).toContain('tempFormat');
      expect(stateKeys).not.toContain('activity');
    });
  });

  describe('State Integration', () => {
    it('should handle complex state updates without interference', () => {
      // Arrange
      const { result } = renderHook(() => useStore());

      // Act - Perform multiple updates
      act(() => {
        result.current.setStyle('masculine');
      });

      act(() => {
        result.current.setActivity('golf');
      });

      act(() => {
        result.current.setTempFormat('metric');
      });

      act(() => {
        result.current.setStyle('feminine');
      });

      act(() => {
        result.current.setActivity('pilates');
      });

      // Assert - All states should have the latest values
      expect(result.current.style).toBe('feminine');
      expect(result.current.activity).toBe('pilates');
      expect(result.current.tempFormat).toBe('metric');
    });

    it('should maintain state consistency across multiple renders', () => {
      // Arrange
      const { result, rerender } = renderHook(() => useStore());

      // Act
      act(() => {
        result.current.setStyle('masculine');
        result.current.setActivity('running');
        result.current.setTempFormat('metric');
      });

      // Rerender
      rerender();

      // Assert - State should persist across rerenders
      expect(result.current.style).toBe('masculine');
      expect(result.current.activity).toBe('running');
      expect(result.current.tempFormat).toBe('metric');
    });

    it('should allow rapid successive updates', () => {
      // Arrange
      const { result } = renderHook(() => useStore());

      // Act - Rapid updates
      act(() => {
        result.current.setActivity('walking');
        result.current.setActivity('jogging');
        result.current.setActivity('running');
        result.current.setActivity('sprinting');
      });

      // Assert - Should have the last value
      expect(result.current.activity).toBe('sprinting');
    });
  });

  describe('Type Safety', () => {
    it('should accept valid OutfitStyle values', () => {
      // Arrange
      const { result } = renderHook(() => useStore());
      const validStyles: OutfitStyle[] = ['masculine', 'feminine', 'neutral'];

      // Act & Assert
      validStyles.forEach(style => {
        act(() => {
          result.current.setStyle(style);
        });
        expect(result.current.style).toBe(style);
      });
    });

    it('should accept valid TempFormat values', () => {
      // Arrange
      const { result } = renderHook(() => useStore());
      const validFormats: TempFormat[] = ['imperial', 'metric'];

      // Act & Assert
      validFormats.forEach(format => {
        act(() => {
          result.current.setTempFormat(format);
        });
        expect(result.current.tempFormat).toBe(format);
      });
    });

    it('should accept any string for activity', () => {
      // Arrange
      const { result } = renderHook(() => useStore());
      const activities = ['', 'running', 'swimming', 'yoga class', 'outdoor hiking'];

      // Act & Assert
      activities.forEach(activity => {
        act(() => {
          result.current.setActivity(activity);
        });
        expect(result.current.activity).toBe(activity);
      });
    });
  });

  describe('Store Isolation', () => {
    it('should share state between multiple hook instances', () => {
      // Arrange
      const { result: result1 } = renderHook(() => useStore());
      const { result: result2 } = renderHook(() => useStore());

      // Act
      act(() => {
        result1.current.setStyle('masculine');
      });

      // Assert - Both instances should see the same state
      expect(result1.current.style).toBe('masculine');
      expect(result2.current.style).toBe('masculine');
    });

    it('should update all hook instances when state changes', () => {
      // Arrange
      const { result: result1 } = renderHook(() => useStore());
      const { result: result2 } = renderHook(() => useStore());
      const { result: result3 } = renderHook(() => useStore());

      // Act
      act(() => {
        result1.current.setActivity('tennis');
      });

      act(() => {
        result2.current.setTempFormat('metric');
      });

      act(() => {
        result3.current.setStyle('feminine');
      });

      // Assert - All instances should have the latest state
      expect(result1.current.style).toBe('feminine');
      expect(result1.current.activity).toBe('tennis');
      expect(result1.current.tempFormat).toBe('metric');

      expect(result2.current.style).toBe('feminine');
      expect(result2.current.activity).toBe('tennis');
      expect(result2.current.tempFormat).toBe('metric');

      expect(result3.current.style).toBe('feminine');
      expect(result3.current.activity).toBe('tennis');
      expect(result3.current.tempFormat).toBe('metric');
    });
  });
});
