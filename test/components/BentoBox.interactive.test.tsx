/**
 * BentoBox Interactive Tests - Testing user interaction state machine
 * These tests should FAIL initially and PASS when interaction features are implemented
 */

import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { BentoBox } from '@/components/BentoBox';
import { mockGeneratedOutfit, mockOutfitItems } from '../__fixtures__/outfitData';
import { renderWithProviders } from '../utils/testHelpers';

// Mock the outfit generator hook
const mockUseOutfitGenerator = {
  outfit: mockGeneratedOutfit,
  loading: false,
  error: null,
  generateOutfit: jest.fn(),
  regenerateItem: jest.fn(), // This doesn't exist yet
  lockItem: jest.fn(), // This doesn't exist yet
  unlockItem: jest.fn(), // This doesn't exist yet
  rejectItem: jest.fn(), // This doesn't exist yet
};

jest.mock('@/hooks/useOutfitGenerator', () => ({
  useOutfitGenerator: () => mockUseOutfitGenerator,
}));

describe('BentoBox Interactive Features', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderBentoBox = () => {
    return renderWithProviders(<BentoBox />);
  };

  describe('item interaction states', () => {
    it('should allow users to tap outfit items for interaction menu', async () => {
      const { getByTestId } = renderBentoBox();

      const topItem = getByTestId('outfit-item-item-1'); // T-shirt
      fireEvent.press(topItem);

      await waitFor(() => {
        expect(getByTestId('interaction-menu')).toBeOnTheScreen();
      });

      // Menu should contain interaction options
      expect(getByTestId('lock-item-button')).toBeOnTheScreen();
      expect(getByTestId('reject-item-button')).toBeOnTheScreen();
      expect(getByTestId('regenerate-item-button')).toBeOnTheScreen();
    });

    it('should lock items to prevent changes during regeneration', async () => {
      const { getByTestId } = renderBentoBox();

      const topItem = getByTestId('outfit-item-item-1');
      fireEvent.press(topItem);

      await waitFor(() => {
        expect(getByTestId('lock-item-button')).toBeOnTheScreen();
      });

      fireEvent.press(getByTestId('lock-item-button'));

      expect(mockUseOutfitGenerator.lockItem).toHaveBeenCalledWith('item-1');
      
      // Item should show locked state
      await waitFor(() => {
        expect(getByTestId('locked-indicator-item-1')).toBeOnTheScreen();
      });
    });

    it('should unlock previously locked items', async () => {
      // Simulate item already locked
      mockUseOutfitGenerator.outfit = {
        ...mockGeneratedOutfit,
        items: mockOutfitItems.map(item => 
          item.id === 'item-1' ? { ...item, isLocked: true } : item
        ),
      };

      const { getByTestId } = renderBentoBox();

      const lockedItem = getByTestId('outfit-item-item-1');
      fireEvent.press(lockedItem);

      await waitFor(() => {
        expect(getByTestId('unlock-item-button')).toBeOnTheScreen();
      });

      fireEvent.press(getByTestId('unlock-item-button'));

      expect(mockUseOutfitGenerator.unlockItem).toHaveBeenCalledWith('item-1');
    });

    it('should reject items and mark them as rejected', async () => {
      const { getByTestId } = renderBentoBox();

      const bottomItem = getByTestId('outfit-item-item-2'); // Chinos
      fireEvent.press(bottomItem);

      await waitFor(() => {
        expect(getByTestId('reject-item-button')).toBeOnTheScreen();
      });

      fireEvent.press(getByTestId('reject-item-button'));

      expect(mockUseOutfitGenerator.rejectItem).toHaveBeenCalledWith('item-2');

      // Item should show rejected state with alternative suggestion
      await waitFor(() => {
        expect(getByTestId('rejected-indicator-item-2')).toBeOnTheScreen();
      });
    });

    it('should regenerate individual items while keeping others', async () => {
      const { getByTestId } = renderBentoBox();

      const shoesItem = getByTestId('outfit-item-item-3'); // Sneakers
      fireEvent.press(shoesItem);

      await waitFor(() => {
        expect(getByTestId('regenerate-item-button')).toBeOnTheScreen();
      });

      fireEvent.press(getByTestId('regenerate-item-button'));

      expect(mockUseOutfitGenerator.regenerateItem).toHaveBeenCalledWith('item-3');

      // Should show loading state for that item
      await waitFor(() => {
        expect(getByTestId('loading-indicator-item-3')).toBeOnTheScreen();
      });
    });
  });

  describe('bulk outfit operations', () => {
    it('should allow regenerating entire outfit while respecting locks', async () => {
      const { getByTestId } = renderBentoBox();

      const regenerateAllButton = getByTestId('regenerate-all-button');
      fireEvent.press(regenerateAllButton);

      expect(mockUseOutfitGenerator.generateOutfit).toHaveBeenCalledWith({
        preserveLocked: true,
        excludeRejected: true,
      });

      // Should show loading for unlocked items only
      await waitFor(() => {
        expect(getByTestId('generating-outfit-indicator')).toBeOnTheScreen();
      });
    });

    it('should provide option to clear all locks and rejections', async () => {
      const { getByTestId } = renderBentoBox();

      const resetButton = getByTestId('reset-preferences-button');
      fireEvent.press(resetButton);

      // Should show confirmation dialog
      await waitFor(() => {
        expect(getByTestId('reset-confirmation-dialog')).toBeOnTheScreen();
      });

      const confirmButton = getByTestId('confirm-reset-button');
      fireEvent.press(confirmButton);

      expect(mockUseOutfitGenerator.clearAllPreferences).toHaveBeenCalled();
    });
  });

  describe('item replacement suggestions', () => {
    it('should show alternative items when rejecting', async () => {
      const { getByTestId } = renderBentoBox();

      const accessoryItem = getByTestId('outfit-item-item-4'); // Sunglasses
      fireEvent.press(accessoryItem);

      await waitFor(() => {
        expect(getByTestId('reject-item-button')).toBeOnTheScreen();
      });

      fireEvent.press(getByTestId('reject-item-button'));

      // Should show alternatives for the same category
      await waitFor(() => {
        expect(getByTestId('alternative-suggestions-item-4')).toBeOnTheScreen();
      });

      // Should have multiple alternatives
      expect(getByTestId('alternative-1')).toBeOnTheScreen();
      expect(getByTestId('alternative-2')).toBeOnTheScreen();
    });

    it('should allow selecting from alternative suggestions', async () => {
      const { getByTestId } = renderBentoBox();

      // Simulate item with alternatives showing
      const alternativeItem = getByTestId('alternative-1');
      fireEvent.press(alternativeItem);

      expect(mockUseOutfitGenerator.selectAlternative).toHaveBeenCalledWith(
        'item-4',
        'alternative-1'
      );

      // Alternative should replace original item
      await waitFor(() => {
        expect(getByTestId('outfit-item-alternative-1')).toBeOnTheScreen();
      });
    });
  });

  describe('visual feedback and animations', () => {
    it('should show loading states during item regeneration', async () => {
      mockUseOutfitGenerator.loading = true;

      const { getByTestId } = renderBentoBox();

      expect(getByTestId('regenerating-items-indicator')).toBeOnTheScreen();
      
      // Individual items being regenerated should show loading
      expect(getByTestId('loading-indicator-item-1')).toBeOnTheScreen();
    });

    it('should highlight locked items with visual indicators', async () => {
      mockUseOutfitGenerator.outfit = {
        ...mockGeneratedOutfit,
        items: mockOutfitItems.map(item => 
          item.id === 'item-1' ? { ...item, isLocked: true } : item
        ),
      };

      const { getByTestId } = renderBentoBox();

      const lockedItem = getByTestId('outfit-item-item-1');
      
      // Should have locked styling
      expect(lockedItem).toHaveStyle({
        borderColor: expect.any(String), // Should have distinct border
        opacity: expect.any(Number),
      });

      expect(getByTestId('lock-icon-item-1')).toBeOnTheScreen();
    });

    it('should show rejected items with strikethrough effect', async () => {
      mockUseOutfitGenerator.outfit = {
        ...mockGeneratedOutfit,
        items: mockOutfitItems.map(item => 
          item.id === 'item-2' ? { ...item, isRejected: true } : item
        ),
      };

      const { getByTestId } = renderBentoBox();

      const rejectedItem = getByTestId('outfit-item-item-2');
      
      // Should have rejected styling
      expect(rejectedItem).toHaveStyle({
        opacity: 0.5,
      });

      expect(getByTestId('rejected-overlay-item-2')).toBeOnTheScreen();
    });
  });

  describe('state persistence', () => {
    it('should maintain item states across outfit regenerations', async () => {
      const { getByTestId } = renderBentoBox();

      // Lock an item
      const topItem = getByTestId('outfit-item-item-1');
      fireEvent.press(topItem);
      
      await waitFor(() => {
        expect(getByTestId('lock-item-button')).toBeOnTheScreen();
      });
      
      fireEvent.press(getByTestId('lock-item-button'));

      // Regenerate outfit
      const regenerateButton = getByTestId('regenerate-all-button');
      fireEvent.press(regenerateButton);

      // Locked item should remain locked after regeneration
      expect(mockUseOutfitGenerator.generateOutfit).toHaveBeenCalledWith({
        preserveLocked: true,
        excludeRejected: true,
      });
    });

    it('should save interaction preferences for future sessions', async () => {
      const { getByTestId } = renderBentoBox();

      // Perform various interactions
      const topItem = getByTestId('outfit-item-item-1');
      fireEvent.press(topItem);
      
      await waitFor(() => {
        expect(getByTestId('lock-item-button')).toBeOnTheScreen();
      });
      
      fireEvent.press(getByTestId('lock-item-button'));

      // Should save preferences
      expect(mockUseOutfitGenerator.savePreferences).toHaveBeenCalledWith({
        lockedItems: ['item-1'],
        rejectedItems: [],
        preferredAlternatives: {},
      });
    });
  });

  describe('accessibility', () => {
    it('should provide proper accessibility labels for interaction buttons', async () => {
      const { getByTestId, getByLabelText } = renderBentoBox();

      const topItem = getByTestId('outfit-item-item-1');
      fireEvent.press(topItem);

      await waitFor(() => {
        expect(getByLabelText('Lock this item')).toBeOnTheScreen();
        expect(getByLabelText('Reject this item')).toBeOnTheScreen();
        expect(getByLabelText('Find alternative for this item')).toBeOnTheScreen();
      });
    });

    it('should announce state changes to screen readers', async () => {
      const { getByTestId } = renderBentoBox();

      const topItem = getByTestId('outfit-item-item-1');
      fireEvent.press(topItem);

      await waitFor(() => {
        expect(getByTestId('lock-item-button')).toBeOnTheScreen();
      });

      fireEvent.press(getByTestId('lock-item-button'));

      // Should announce the state change
      expect(getByTestId('outfit-item-item-1')).toHaveAccessibilityState({
        disabled: false,
        selected: true, // Locked state
      });
    });
  });
});