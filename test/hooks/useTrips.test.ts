/**
 * useTrips Hook Tests - Testing trip management state and operations
 * These tests should PASS as the hook is fully implemented
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useTrips } from '@/hooks/useTrips';
import * as tripStorageService from '@/services/tripStorageService';
import { mockTrip, mockTrips, createMockTrip } from '../__fixtures__/tripData';

// Mock the trip storage service
jest.mock('@/services/tripStorageService', () => ({
  loadTrips: jest.fn(),
  addTrip: jest.fn(),
  updateTrip: jest.fn(),
  deleteTrip: jest.fn(),
  clearAllTrips: jest.fn(),
}));

const mockTripStorage = tripStorageService as jest.Mocked<typeof tripStorageService>;

describe('useTrips', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should initialize with empty trips and loading false', () => {
      mockTripStorage.loadTrips.mockResolvedValue([]);

      const { result } = renderHook(() => useTrips());

      expect(result.current.trips).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe('loading trips', () => {
    it('should load trips on mount', async () => {
      mockTripStorage.loadTrips.mockResolvedValue(mockTrips);

      const { result } = renderHook(() => useTrips());

      await waitFor(() => {
        expect(result.current.trips).toHaveLength(3);
      });

      expect(mockTripStorage.loadTrips).toHaveBeenCalledTimes(1);
      expect(result.current.loading).toBe(false);
    });

    it('should set loading state during trip loading', async () => {
      let resolveLoadTrips: (trips: any[]) => void;
      const loadTripsPromise = new Promise<any[]>((resolve) => {
        resolveLoadTrips = resolve;
      });
      mockTripStorage.loadTrips.mockReturnValue(loadTripsPromise);

      const { result } = renderHook(() => useTrips());

      // Initially loading should be true
      expect(result.current.loading).toBe(true);

      act(() => {
        resolveLoadTrips(mockTrips);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle loading errors gracefully', async () => {
      const error = new Error('Failed to load trips');
      mockTripStorage.loadTrips.mockRejectedValue(error);

      const { result } = renderHook(() => useTrips());

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to load trips');
      });

      expect(result.current.trips).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('refreshTrips', () => {
    it('should reload trips from storage', async () => {
      mockTripStorage.loadTrips
        .mockResolvedValueOnce([mockTrips[0]])
        .mockResolvedValueOnce(mockTrips);

      const { result } = renderHook(() => useTrips());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.trips).toHaveLength(1);
      });

      // Refresh trips
      await act(async () => {
        await result.current.refreshTrips();
      });

      await waitFor(() => {
        expect(result.current.trips).toHaveLength(3);
      });

      expect(mockTripStorage.loadTrips).toHaveBeenCalledTimes(2);
    });

    it('should set loading state during refresh', async () => {
      mockTripStorage.loadTrips.mockResolvedValue([]);

      const { result } = renderHook(() => useTrips());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.refreshTrips();
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('addTrip', () => {
    it('should add new trip and update state', async () => {
      const newTrip = createMockTrip({ location: 'Berlin, Germany' });
      const updatedTrips = [...mockTrips, newTrip];

      mockTripStorage.loadTrips.mockResolvedValue(mockTrips);
      mockTripStorage.addTrip.mockResolvedValue(updatedTrips);

      const { result } = renderHook(() => useTrips());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.trips).toHaveLength(3);
      });

      // Add trip
      await act(async () => {
        await result.current.addTrip(newTrip);
      });

      expect(mockTripStorage.addTrip).toHaveBeenCalledWith(newTrip);
      expect(result.current.trips).toHaveLength(4);
      expect(result.current.trips[3].location).toBe('Berlin, Germany');
    });

    it('should handle add errors gracefully', async () => {
      const newTrip = createMockTrip();
      const error = new Error('Failed to add trip');
      
      mockTripStorage.loadTrips.mockResolvedValue(mockTrips);
      mockTripStorage.addTrip.mockRejectedValue(error);

      const { result } = renderHook(() => useTrips());

      await waitFor(() => {
        expect(result.current.trips).toHaveLength(3);
      });

      await act(async () => {
        await result.current.addTrip(newTrip);
      });

      expect(result.current.error).toBe('Failed to add trip');
      expect(result.current.trips).toHaveLength(3); // Should remain unchanged
    });
  });

  describe('updateTrip', () => {
    it('should update existing trip and refresh state', async () => {
      const updatedTrip = { ...mockTrips[0], location: 'Updated Location' };
      const updatedTrips = [updatedTrip, ...mockTrips.slice(1)];

      mockTripStorage.loadTrips.mockResolvedValue(mockTrips);
      mockTripStorage.updateTrip.mockResolvedValue(updatedTrips);

      const { result } = renderHook(() => useTrips());

      await waitFor(() => {
        expect(result.current.trips).toHaveLength(3);
      });

      await act(async () => {
        await result.current.updateTrip(updatedTrip);
      });

      expect(mockTripStorage.updateTrip).toHaveBeenCalledWith(updatedTrip);
      expect(result.current.trips[0].location).toBe('Updated Location');
    });
  });

  describe('deleteTrip', () => {
    it('should delete trip by id and update state', async () => {
      const remainingTrips = mockTrips.filter(trip => trip.id !== 'trip-2');

      mockTripStorage.loadTrips.mockResolvedValue(mockTrips);
      mockTripStorage.deleteTrip.mockResolvedValue(remainingTrips);

      const { result } = renderHook(() => useTrips());

      await waitFor(() => {
        expect(result.current.trips).toHaveLength(3);
      });

      await act(async () => {
        await result.current.deleteTrip('trip-2');
      });

      expect(mockTripStorage.deleteTrip).toHaveBeenCalledWith('trip-2');
      expect(result.current.trips).toHaveLength(2);
      expect(result.current.trips.find(trip => trip.id === 'trip-2')).toBeUndefined();
    });

    it('should handle delete errors gracefully', async () => {
      const error = new Error('Failed to delete trip');
      
      mockTripStorage.loadTrips.mockResolvedValue(mockTrips);
      mockTripStorage.deleteTrip.mockRejectedValue(error);

      const { result } = renderHook(() => useTrips());

      await waitFor(() => {
        expect(result.current.trips).toHaveLength(3);
      });

      await act(async () => {
        await result.current.deleteTrip('trip-1');
      });

      expect(result.current.error).toBe('Failed to delete trip');
      expect(result.current.trips).toHaveLength(3); // Should remain unchanged
    });
  });

  describe('clearAllTrips', () => {
    it('should clear all trips and update state', async () => {
      mockTripStorage.loadTrips.mockResolvedValue(mockTrips);
      mockTripStorage.clearAllTrips.mockResolvedValue();

      const { result } = renderHook(() => useTrips());

      await waitFor(() => {
        expect(result.current.trips).toHaveLength(3);
      });

      await act(async () => {
        await result.current.clearAllTrips();
      });

      expect(mockTripStorage.clearAllTrips).toHaveBeenCalled();
      expect(result.current.trips).toEqual([]);
    });
  });
});