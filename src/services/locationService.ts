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

// Geocoding function using Google Places API (since we don't have Geocoding API access)
export const geocodeLocationString = async (locationString: string): Promise<LocationValidationResult> => {
  if (!locationString.trim()) {
    return { isValid: false, error: 'Location cannot be empty' };
  }

  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.warn('Google Places API key not configured, cannot geocode location');
    return { isValid: false, error: 'Google Places API key not configured' };
  }

  try {
    await geocodingRateLimiter.checkRateLimit();

    // Step 1: Use Places Autocomplete to find the place
    console.log('🔍 Step 1: Finding place with Autocomplete API for:', locationString);
    const autocompleteResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(locationString)}&types=geocode&key=${apiKey}`
    );
    
    if (!autocompleteResponse.ok) {
      throw new Error(`HTTP ${autocompleteResponse.status}: ${autocompleteResponse.statusText}`);
    }

    const autocompleteData = await autocompleteResponse.json();
    
    console.log('🔍 Autocomplete response:', {
      status: autocompleteData.status,
      predictionsLength: autocompleteData.predictions?.length || 0,
      locationString
    });
    
    if (autocompleteData.status === 'REQUEST_DENIED') {
      const errorMsg = autocompleteData.error_message || 'Google Places API access denied - check API key permissions';
      console.error('🔍 Places Autocomplete API access denied:', { status: autocompleteData.status, error: errorMsg });
      return { isValid: false, error: errorMsg };
    }
    
    if (!autocompleteData.predictions || autocompleteData.predictions.length === 0) {
      const errorMsg = `No places found for: ${locationString}`;
      console.error('🔍 No autocomplete results:', { status: autocompleteData.status, error: errorMsg });
      return { isValid: false, error: errorMsg };
    }

    // Get the first prediction (best match)
    const place = autocompleteData.predictions[0];
    const placeId = place.place_id;
    
    console.log('📍 Step 2: Getting place details for place_id:', placeId);
    
    // Step 2: Use Place Details to get coordinates
    const detailsResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address,address_components&key=${apiKey}`
    );
    
    if (!detailsResponse.ok) {
      throw new Error(`HTTP ${detailsResponse.status}: ${detailsResponse.statusText}`);
    }

    const detailsData = await detailsResponse.json();
    
    console.log('📍 Place details response:', {
      status: detailsData.status,
      hasResult: !!detailsData.result,
      placeId
    });
    
    if (detailsData.status === 'REQUEST_DENIED') {
      const errorMsg = detailsData.error_message || 'Google Places Details API access denied';
      console.error('📍 Places Details API access denied:', { status: detailsData.status, error: errorMsg });
      return { isValid: false, error: errorMsg };
    }
    
    if (!detailsData.result) {
      const errorMsg = `No details found for place: ${locationString}`;
      console.error('📍 No place details:', { status: detailsData.status, error: errorMsg });
      return { isValid: false, error: errorMsg };
    }

    const result = detailsData.result;
    const geometry = result.geometry;
    
    if (!geometry || !geometry.location) {
      const errorMsg = `No coordinates found for: ${locationString}`;
      console.error('📍 No geometry data:', { error: errorMsg });
      return { isValid: false, error: errorMsg };
    }
    
    // Extract clean location name (city, state for US locations)
    const addressComponents = result.address_components || [];
    let formattedName = result.formatted_address;
    
    // Try to create a cleaner US format: "City, State"
    const city = addressComponents.find((comp: any) => comp.types.includes('locality'))?.long_name;
    const state = addressComponents.find((comp: any) => comp.types.includes('administrative_area_level_1'))?.short_name;
    const country = addressComponents.find((comp: any) => comp.types.includes('country'))?.short_name;
    
    if (city && state && country === 'US') {
      formattedName = `${city}, ${state}`;
    } else if (city && country !== 'US') {
      formattedName = `${city}, ${country}`;
    }

    const coordinates = {
      lat: geometry.location.lat,
      lon: geometry.location.lng,
    };

    console.log('✅ Geocoding successful:', { 
      locationString, 
      formattedName, 
      coordinates 
    });

    return {
      isValid: true,
      coordinates,
      formattedName,
    };
  } catch (error) {
    console.error('Location geocoding error:', error);
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : 'Failed to geocode location' 
    };
  }
};

// Keep the old function for backwards compatibility but mark as deprecated
export const validateLocation = validateLocationWithGooglePlaces;