import { geocodingRateLimiter } from './rateLimiter';

export interface LocationValidationResult {
  isValid: boolean;
  coordinates?: {
    lat: number;
    lon: number;
  };
  formattedName?: string;
  error?: string;
}

export const validateLocationWithGooglePlaces = async (locationString: string): Promise<LocationValidationResult> => {
  if (!locationString.trim()) {
    return { isValid: false, error: 'Location cannot be empty' };
  }

  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.warn('Google Places API key not configured, cannot validate location');
    return { isValid: false, error: 'Google Places API key not configured' };
  }

  try {
    await geocodingRateLimiter.checkRateLimit();

    // Use Google Places Geocoding API for better location recognition
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationString)}&key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return { isValid: false, error: 'Location not found' };
    }

    const location = data.results[0];
    const geometry = location.geometry;
    
    // Extract clean location name (city, state for US locations)
    const addressComponents = location.address_components;
    let formattedName = location.formatted_address;
    
    // Try to create a cleaner US format: "City, State"
    const city = addressComponents.find((comp: any) => comp.types.includes('locality'))?.long_name;
    const state = addressComponents.find((comp: any) => comp.types.includes('administrative_area_level_1'))?.short_name;
    const country = addressComponents.find((comp: any) => comp.types.includes('country'))?.short_name;
    
    if (city && state && country === 'US') {
      formattedName = `${city}, ${state}`;
    } else if (city && country !== 'US') {
      formattedName = `${city}, ${country}`;
    }

    return {
      isValid: true,
      coordinates: {
        lat: geometry.location.lat,
        lon: geometry.location.lng,
      },
      formattedName,
    };
  } catch (error) {
    console.error('Google Places validation error:', error);
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : 'Failed to validate location' 
    };
  }
};

// Keep the old function for backwards compatibility but mark as deprecated
export const validateLocation = validateLocationWithGooglePlaces;