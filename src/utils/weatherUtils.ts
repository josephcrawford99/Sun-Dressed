// Utility functions for weather data formatting

/**
 * Convert wind direction degrees to compass direction
 */
export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/**
 * Format Unix timestamp to time string (e.g., "6:42 AM")
 */
export function formatTime(timestamp: number, use24Hour = false): string {
  if (!timestamp) return '--';
  
  const date = new Date(timestamp * 1000);
  
  if (use24Hour) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }
  
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Get precipitation timing message based on chance of rain
 */
export function getPrecipitationMessage(chanceOfRain: number, precipitationUnit: string, description?: string): string {
  if (chanceOfRain === 0) {
    return 'No rain expected';
  }
  
  if (chanceOfRain <= 20) {
    return 'Unlikely to rain';
  }
  
  if (chanceOfRain <= 40) {
    return 'Light rain possible';
  }
  
  if (chanceOfRain <= 70) {
    return 'Rain likely';
  }
  
  // For high chances, use description if available
  if (description) {
    const timing = chanceOfRain >= 90 ? 'Expected' : 'Very likely';
    return `${timing}: ${description}`;
  }
  
  return 'Heavy rain expected';
}

/**
 * Get pressure trend indicator (basic version - would need historical data for real trends)
 */
export function getPressureDescription(pressure: number): string {
  if (pressure < 1000) {
    return 'Low pressure (storms likely)';
  } else if (pressure > 1020) {
    return 'High pressure (clear skies)';
  } else {
    return 'Normal pressure';
  }
}