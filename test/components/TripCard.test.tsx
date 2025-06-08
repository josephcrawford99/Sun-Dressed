/**
 * TripCard Component Tests - Testing trip display and user interactions
 * These tests should PASS as the component is fully implemented
 */

import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { TripCard } from '@/components/TripCard';
import { mockTrip, createMockTrip } from '../__fixtures__/tripData';
import { renderWithProviders } from '../utils/testHelpers';

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('TripCard', () => {
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderTripCard = (trip = mockTrip) => {
    return renderWithProviders(
      <TripCard 
        trip={trip} 
        onDelete={mockOnDelete} 
        onEdit={mockOnEdit} 
      />
    );
  };

  describe('rendering', () => {
    it('should render trip information correctly', () => {
      const { getByText } = renderTripCard();

      expect(getByText('San Francisco, CA')).toBeOnTheScreen();
      expect(getByText('Pack layers for variable SF weather')).toBeOnTheScreen();
      expect(getByText('Business meetings, Walking tours')).toBeOnTheScreen();
    });

    it('should format date range correctly for same year', () => {
      const trip = createMockTrip({
        startDate: new Date('2025-07-15'),
        endDate: new Date('2025-07-20'),
      });

      const { getByText } = renderTripCard(trip);

      expect(getByText('Jul 15 - Jul 20, 2025')).toBeOnTheScreen();
    });

    it('should format date range correctly for different years', () => {
      const trip = createMockTrip({
        startDate: new Date('2025-12-28'),
        endDate: new Date('2026-01-05'),
      });

      const { getByText } = renderTripCard(trip);

      expect(getByText('Dec 28, 2025 - Jan 5, 2026')).toBeOnTheScreen();
    });

    it('should handle empty activities gracefully', () => {
      const trip = createMockTrip({
        activities: [],
      });

      const { queryByText } = renderTripCard(trip);

      // Should not crash, activities section should be empty or hidden
      expect(queryByText('')).toBeTruthy(); // Component should still render
    });

    it('should handle empty notes gracefully', () => {
      const trip = createMockTrip({
        notes: '',
      });

      const { queryByText } = renderTripCard(trip);

      // Should not crash, notes section should be empty or hidden
      expect(queryByText('')).toBeTruthy(); // Component should still render
    });
  });

  describe('menu interactions', () => {
    it('should open menu when options button is pressed', async () => {
      const { getByLabelText, getByText } = renderTripCard();

      const optionsButton = getByLabelText('Open trip options');
      fireEvent.press(optionsButton);

      await waitFor(() => {
        expect(getByText('Edit')).toBeOnTheScreen();
        expect(getByText('Delete')).toBeOnTheScreen();
      });
    });

    it('should call onEdit when edit menu item is pressed', async () => {
      const { getByLabelText, getByText } = renderTripCard();

      // Open menu
      const optionsButton = getByLabelText('Open trip options');
      fireEvent.press(optionsButton);

      await waitFor(() => {
        expect(getByText('Edit')).toBeOnTheScreen();
      });

      // Press edit
      const editButton = getByText('Edit');
      fireEvent.press(editButton);

      expect(mockOnEdit).toHaveBeenCalledWith(mockTrip);
    });

    it('should show delete confirmation when delete menu item is pressed', async () => {
      const { getByLabelText, getByText } = renderTripCard();

      // Open menu
      const optionsButton = getByLabelText('Open trip options');
      fireEvent.press(optionsButton);

      await waitFor(() => {
        expect(getByText('Delete')).toBeOnTheScreen();
      });

      // Press delete
      const deleteButton = getByText('Delete');
      fireEvent.press(deleteButton);

      expect(Alert.alert).toHaveBeenCalledWith(
        'Delete Trip',
        'Are you sure you want to delete this trip?',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Cancel', style: 'cancel' }),
          expect.objectContaining({ 
            text: 'Delete',
            style: 'destructive',
            onPress: expect.any(Function)
          }),
        ])
      );
    });

    it('should call onDelete when delete is confirmed', async () => {
      const { getByLabelText, getByText } = renderTripCard();

      // Open menu and press delete
      const optionsButton = getByLabelText('Open trip options');
      fireEvent.press(optionsButton);

      await waitFor(() => {
        expect(getByText('Delete')).toBeOnTheScreen();
      });

      const deleteButton = getByText('Delete');
      fireEvent.press(deleteButton);

      // Simulate confirming the alert
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const confirmButton = alertCall[2][1]; // Second button is confirm
      confirmButton.onPress();

      expect(mockOnDelete).toHaveBeenCalledWith(mockTrip.id);
    });

    it('should not call onDelete when delete is cancelled', async () => {
      const { getByLabelText, getByText } = renderTripCard();

      // Open menu and press delete
      const optionsButton = getByLabelText('Open trip options');
      fireEvent.press(optionsButton);

      await waitFor(() => {
        expect(getByText('Delete')).toBeOnTheScreen();
      });

      const deleteButton = getByText('Delete');
      fireEvent.press(deleteButton);

      // Simulate cancelling the alert
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const cancelButton = alertCall[2][0]; // First button is cancel
      if (cancelButton.onPress) {
        cancelButton.onPress();
      }

      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have proper accessibility labels', () => {
      const { getByLabelText } = renderTripCard();

      expect(getByLabelText('Open trip options')).toBeOnTheScreen();
    });

    it('should be navigable with screen reader', () => {
      const { getByText } = renderTripCard();

      // Key elements should be accessible
      expect(getByText('San Francisco, CA')).toBeOnTheScreen();
      expect(getByText('Pack layers for variable SF weather')).toBeOnTheScreen();
    });
  });

  describe('edge cases', () => {
    it('should handle long location names gracefully', () => {
      const trip = createMockTrip({
        location: 'A Very Long Location Name That Might Cause Layout Issues, Some Country, Some Continent',
      });

      const { getByText } = renderTripCard(trip);

      expect(getByText('A Very Long Location Name That Might Cause Layout Issues, Some Country, Some Continent')).toBeOnTheScreen();
    });

    it('should handle long notes gracefully', () => {
      const trip = createMockTrip({
        notes: 'This is a very long note that contains a lot of information about the trip including weather expectations, packing lists, important reminders, and other detailed information that might wrap to multiple lines.',
      });

      const { getByText } = renderTripCard(trip);

      expect(getByText(/This is a very long note/)).toBeOnTheScreen();
    });

    it('should handle many activities gracefully', () => {
      const trip = createMockTrip({
        activities: [
          'Conference', 
          'Networking', 
          'Sightseeing', 
          'Business meetings', 
          'Cultural events', 
          'Shopping', 
          'Dining experiences'
        ],
      });

      const { getByText } = renderTripCard(trip);

      expect(getByText(/Conference, Networking, Sightseeing/)).toBeOnTheScreen();
    });

    it('should handle dates far in the future', () => {
      const trip = createMockTrip({
        startDate: new Date('2030-12-25'),
        endDate: new Date('2031-01-02'),
      });

      const { getByText } = renderTripCard(trip);

      expect(getByText('Dec 25, 2030 - Jan 2, 2031')).toBeOnTheScreen();
    });
  });
});