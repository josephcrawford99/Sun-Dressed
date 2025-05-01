import axios from 'axios';
import { WEATHER_API } from '../utils/constants';
import type { UserLocation } from '../utils/useLocation';

export interface LocationSuggestion {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
  distance?: number; // Distance in kilometers (will be converted to miles if needed)
}

class LocationError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'LocationError';
  }
}

/**
 * Calculate distance between two points using the Haversine formula
 * @returns Distance in kilometers
 */
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Convert kilometers to miles
 */
export const kmToMiles = (km: number): number => {
  return km * 0.621371;
};

/**
 * Format distance based on user preferences
 */
export const formatDistance = (distanceKm: number, useImperial: boolean): string => {
  if (useImperial) {
    const miles = kmToMiles(distanceKm);
    return `${Math.round(miles)}mi`;
  }
  return `${Math.round(distanceKm)}km`;
};

/**
 * Search for location suggestions using OpenWeatherMap's Geocoding API
 */
export const searchLocations = async (
  query: string,
  userLocation?: UserLocation | null,
  limit: number = 5
): Promise<LocationSuggestion[]> => {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await axios.get(
      'https://api.openweathermap.org/geo/1.0/direct',
      {
        params: {
          q: query,
          limit: limit * 2, // Request more results to allow for sorting
          appid: WEATHER_API.KEY
        }
      }
    );

    let results = response.data.map((location: any) => ({
      name: location.name,
      state: location.state,
      country: location.country,
      lat: location.lat,
      lon: location.lon
    }));

    // If user location is available, calculate distances and sort
    if (userLocation) {
      results = results.map((location: LocationSuggestion) => ({
        ...location,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          location.lat,
          location.lon
        )
      }));

      // Sort by distance
      results.sort((a: LocationSuggestion, b: LocationSuggestion) =>
        (a.distance || 0) - (b.distance || 0)
      );
    }

    // Return only the requested number of results
    return results.slice(0, limit);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new LocationError('Invalid API key. Please check your configuration.', 'INVALID_API_KEY');
      } else if (!error.response) {
        throw new LocationError('Network error. Please check your connection.', 'NETWORK_ERROR');
      }
    }
    throw new LocationError('Failed to fetch location suggestions. Please try again.', 'UNKNOWN_ERROR');
  }
};

/**
 * Format location for display and storage
 */
export const formatLocation = (location: LocationSuggestion): string => {
  const parts = [location.name];
  if (location.state) {
    parts.push(location.state);
  }
  parts.push(location.country);
  return parts.join(', ');
};

/**
 * Parse a formatted location string back into its components
 * @param formattedLocation The formatted location string (e.g., "New York, NY, US")
 */
export const parseLocation = (formattedLocation: string): string[] => {
  return formattedLocation.split(',').map(part => part.trim());
};

/**
 * Get nearest city from coordinates using OpenWeatherMap's reverse geocoding
 */
export const getNearestCity = async (
  latitude: number,
  longitude: number
): Promise<LocationSuggestion> => {
  try {
    const response = await axios.get(
      'https://api.openweathermap.org/geo/1.0/reverse',
      {
        params: {
          lat: latitude,
          lon: longitude,
          limit: 1,
          appid: WEATHER_API.KEY
        }
      }
    );

    if (!response.data || response.data.length === 0) {
      throw new LocationError('No cities found near this location', 'NO_RESULTS');
    }

    const location = response.data[0];
    return {
      name: location.name,
      state: location.state,
      country: location.country,
      lat: location.lat,
      lon: location.lon,
      distance: 0 // It's the current location, so distance is 0
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new LocationError('Invalid API key. Please check your configuration.', 'INVALID_API_KEY');
      } else if (!error.response) {
        throw new LocationError('Network error. Please check your connection.', 'NETWORK_ERROR');
      }
    }
    throw new LocationError('Failed to get nearest city. Please try again.', 'UNKNOWN_ERROR');
  }
};
