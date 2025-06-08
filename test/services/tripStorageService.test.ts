/**
 * Trip Storage Service Tests - Testing AsyncStorage CRUD operations
 * These tests should PASS as the service is fully implemented
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  loadTrips, 
  saveTrips, 
  addTrip, 
  updateTrip, 
  deleteTrip, 
  clearAllTrips 
} from '@/services/tripStorageService';
import { mockTrip, mockTrips, createMockTrip } from '../__fixtures__/tripData';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('tripStorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadTrips', () => {
    it('should return empty array when no trips are stored', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await loadTrips();

      expect(result).toEqual([]);
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('trips');
    });

    it('should return parsed trips when trips are stored', async () => {
      const storedTrips = JSON.stringify(mockTrips);
      mockAsyncStorage.getItem.mockResolvedValue(storedTrips);

      const result = await loadTrips();

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('trip-1');
      expect(result[0].location).toBe('New York, NY');
    });

    it('should handle invalid JSON gracefully', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('invalid-json');

      const result = await loadTrips();

      expect(result).toEqual([]);
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const result = await loadTrips();

      expect(result).toEqual([]);
    });
  });

  describe('saveTrips', () => {
    it('should save trips to AsyncStorage', async () => {
      mockAsyncStorage.setItem.mockResolvedValue();

      await saveTrips(mockTrips);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'trips',
        JSON.stringify(mockTrips)
      );
    });

    it('should handle save errors gracefully', async () => {
      mockAsyncStorage.setItem.mockRejectedValue(new Error('Save error'));

      // Should not throw
      await expect(saveTrips(mockTrips)).resolves.not.toThrow();
    });
  });

  describe('addTrip', () => {
    it('should add new trip to existing trips', async () => {
      const existingTrips = JSON.stringify([mockTrips[0]]);
      mockAsyncStorage.getItem.mockResolvedValue(existingTrips);
      mockAsyncStorage.setItem.mockResolvedValue();

      const newTrip = createMockTrip({ location: 'Paris, France' });
      const result = await addTrip(newTrip);

      expect(result).toHaveLength(2);
      expect(result[1].location).toBe('Paris, France');
      expect(mockAsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should add trip to empty storage', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue();

      const result = await addTrip(mockTrip);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockTrip.id);
    });
  });

  describe('updateTrip', () => {
    it('should update existing trip', async () => {
      const storedTrips = JSON.stringify(mockTrips);
      mockAsyncStorage.getItem.mockResolvedValue(storedTrips);
      mockAsyncStorage.setItem.mockResolvedValue();

      const updatedTrip = { ...mockTrips[0], location: 'Updated Location' };
      const result = await updateTrip(updatedTrip);

      expect(result).toHaveLength(3);
      expect(result[0].location).toBe('Updated Location');
      expect(result[0].updatedAt).toBeDefined();
    });

    it('should return unchanged trips if trip not found', async () => {
      const storedTrips = JSON.stringify(mockTrips);
      mockAsyncStorage.getItem.mockResolvedValue(storedTrips);

      const nonExistentTrip = createMockTrip({ id: 'non-existent' });
      const result = await updateTrip(nonExistentTrip);

      expect(result).toHaveLength(3);
      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 'trip-1' }),
        expect.objectContaining({ id: 'trip-2' }),
        expect.objectContaining({ id: 'trip-3' }),
      ]));
    });
  });

  describe('deleteTrip', () => {
    it('should remove trip by id', async () => {
      const storedTrips = JSON.stringify(mockTrips);
      mockAsyncStorage.getItem.mockResolvedValue(storedTrips);
      mockAsyncStorage.setItem.mockResolvedValue();

      const result = await deleteTrip('trip-2');

      expect(result).toHaveLength(2);
      expect(result.find(trip => trip.id === 'trip-2')).toBeUndefined();
      expect(result.find(trip => trip.id === 'trip-1')).toBeDefined();
    });

    it('should return unchanged trips if trip not found', async () => {
      const storedTrips = JSON.stringify(mockTrips);
      mockAsyncStorage.getItem.mockResolvedValue(storedTrips);

      const result = await deleteTrip('non-existent');

      expect(result).toHaveLength(3);
    });
  });

  describe('clearAllTrips', () => {
    it('should remove all trips from storage', async () => {
      mockAsyncStorage.removeItem.mockResolvedValue();

      await clearAllTrips();

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('trips');
    });

    it('should handle clear errors gracefully', async () => {
      mockAsyncStorage.removeItem.mockRejectedValue(new Error('Clear error'));

      // Should not throw
      await expect(clearAllTrips()).resolves.not.toThrow();
    });
  });
});