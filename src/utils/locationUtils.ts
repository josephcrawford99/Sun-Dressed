interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

/**
 * Extracts a standardized "City, State/Country" format from Google's address components.
 * Prioritizes administrative_area_level_1 (state/province) over country for larger administrative areas.
 * 
 * @param components - Array of address components from Google Places/Geocoding API
 * @returns Formatted location string like "Washington, DC" or "Riga, LV" or null if unable to extract
 */
export function extractLocationParts(components: AddressComponent[]): string | null {
  if (!components || components.length === 0) {
    return null;
  }

  // Find locality (city/town)
  const localityComponent = components.find(comp => 
    comp.types.includes('locality')
  );

  // Find administrative area level 1 (state/province)  
  const admin1Component = components.find(comp => 
    comp.types.includes('administrative_area_level_1')
  );

  // Find country as fallback
  const countryComponent = components.find(comp => 
    comp.types.includes('country')
  );

  // Extract the city name
  const city = localityComponent?.short_name || localityComponent?.long_name;

  // Extract the larger administrative area (prefer state over country)
  const largerArea = admin1Component?.short_name || countryComponent?.short_name;

  // Return formatted string if both parts are available
  if (city && largerArea) {
    return `${city}, ${largerArea}`;
  }

  return null;
}

/**
 * Helper function to find a specific address component by type
 */
function findComponentByType(components: AddressComponent[], type: string): AddressComponent | undefined {
  return components.find(comp => comp.types.includes(type));
}

export { findComponentByType };
export type { AddressComponent };