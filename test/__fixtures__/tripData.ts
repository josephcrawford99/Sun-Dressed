/**
 * Trip Data Fixtures - Realistic test data for trip functionality
 */

import { Trip } from '@/types/trip';

export const mockTrip: Trip = {
  id: 'test-trip-1',
  location: 'San Francisco, CA',
  startDate: new Date('2025-07-15'),
  endDate: new Date('2025-07-20'),
  activities: ['Business meetings', 'Walking tours'],
  notes: 'Pack layers for variable SF weather',
  createdAt: new Date('2025-06-08'),
  updatedAt: new Date('2025-06-08'),
};

export const mockTrips: Trip[] = [
  {
    id: 'trip-1',
    location: 'New York, NY',
    startDate: new Date('2025-06-20'),
    endDate: new Date('2025-06-25'),
    activities: ['Conference', 'Networking events'],
    notes: 'Summer business trip',
    createdAt: new Date('2025-06-01'),
    updatedAt: new Date('2025-06-01'),
  },
  {
    id: 'trip-2',
    location: 'Tokyo, Japan',
    startDate: new Date('2025-08-10'),
    endDate: new Date('2025-08-20'),
    activities: ['Sightseeing', 'Cultural experiences'],
    notes: 'Vacation - humid summer weather expected',
    createdAt: new Date('2025-06-05'),
    updatedAt: new Date('2025-06-05'),
  },
  {
    id: 'trip-3',
    location: 'London, UK',
    startDate: new Date('2025-09-01'),
    endDate: new Date('2025-09-07'),
    activities: ['Business meetings', 'Team building'],
    notes: 'Autumn weather - pack rain gear',
    createdAt: new Date('2025-06-08'),
    updatedAt: new Date('2025-06-08'),
  },
];

export const createMockTrip = (overrides: Partial<Trip> = {}): Trip => ({
  id: `test-trip-${Date.now()}`,
  location: 'Test Location',
  startDate: new Date('2025-07-01'),
  endDate: new Date('2025-07-05'),
  activities: ['Test activity'],
  notes: 'Test notes',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});