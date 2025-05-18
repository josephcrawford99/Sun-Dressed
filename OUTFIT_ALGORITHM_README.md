# Outfit Suggestion Algorithm Implementation

This document provides an overview of the Sun Dressed app's outfit suggestion algorithm implementation. The algorithm recommends optimal clothing combinations based on weather conditions and user preferences as specified in the original algorithm specification.

## Files Implemented

1. `src/types/clothing.ts` - TypeScript interfaces and types for clothing data
2. `src/mocks/clothingData.json` - Sample clothing data for testing
3. `src/utils/outfitAlgorithm.ts` - Main algorithm implementation
4. `src/utils/outfitAlgorithmTest.ts` - Test utility with examples

## Architecture Overview

The algorithm follows a functional approach with modular components:

1. **Filtering System**: Filters available clothing items based on style preference, seasonal appropriateness, and explicit inclusions/exclusions.

2. **Outfit Generation**: Creates valid outfit combinations using template structures (top+bottom+shoes or dress+shoes), with weather-specific additions like outerwear, rain gear, and sun protection.

3. **Scoring System**: Scores each outfit using a weighted formula combining:
   - Temperature appropriateness (40%)
   - Weather protection (15%)
   - User preference (25%)
   - Style cohesion (10%)
   - Recency/variety (10%)

4. **Adaptation Mechanisms**: Updates item scores and relationships based on user feedback, including temperature calibration and style learning.

## Key Components

### Core Types (`clothing.ts`)

- `ClothingItem`: Interface for individual clothing items with properties for basic info, weather characteristics, style, and user interaction data.
- `Outfit`: Interface for complete outfits consisting of multiple clothing items.
- `OutfitAlgorithmParams`: Interface for the main algorithm function parameters.
- `OutfitFeedback`: Interface for user feedback on suggested outfits.

### Main Algorithm Functions (`outfitAlgorithm.ts`)

- `filterAvailableItems()`: Filters clothing based on style, season, and exclusions.
- `generateOutfitTemplates()`: Creates valid outfit combinations.
- `scoreOutfit()`: Calculates the overall score for an outfit.
- `suggestOutfit()`: Main function that combines all steps to recommend the optimal outfit.
- `processOutfitFeedback()`: Updates item properties based on user feedback.

### Test Utility (`outfitAlgorithmTest.ts`)

- Contains example scenarios showing how to use the algorithm in different weather conditions.
- Demonstrates the feedback process and how it affects future recommendations.

## Usage Examples

### Basic Outfit Suggestion

```typescript
import { suggestOutfit } from './utils/outfitAlgorithm';
import clothingDataJson from './mocks/clothingData.json';

// Get clothing items from storage/database
const clothingItems = clothingDataJson.clothingItems;

// Current weather data from weather service
const weatherData = {
  temperature: 22,
  feels_like: 24,
  wind_speed: 5,
  chance_of_rain: 10,
  icon: '01d'  // Clear sky
};

// User's style preference from settings
const stylePreference = 'neutral';

// Optional items to include or exclude based on user feedback
const includeItems = []; // IDs of items with thumbs-up
const excludeItems = []; // IDs of items with thumbs-down

// Get suggestion
const suggestedOutfit = suggestOutfit({
  weatherData,
  stylePreference,
  clothingItems,
  includeItems,
  excludeItems
});

// Use the suggested outfit in the UI
console.log(suggestedOutfit);
```

### Processing User Feedback

```typescript
import { processOutfitFeedback } from './utils/outfitAlgorithm';

// When user provides feedback on an outfit
const feedback = {
  outfitId: 't1-b1-s1', // IDs of items in the outfit
  temperatureFeedback: 'too_hot', // User felt too hot
  itemFeedback: [
    { itemId: 't1', liked: false }, // User didn't like the top
    { itemId: 'b1', liked: true }   // User liked the bottom
  ],
  timestamp: Date.now(),
  temperature: 22 // Current temperature
};

// Update clothing items with this feedback
const updatedItems = processOutfitFeedback(feedback, clothingItems);

// Save updated items to storage/database
// saveClothingItems(updatedItems);
```

## Adaptation Mechanisms

The algorithm adapts to user preferences through several mechanisms:

1. **Temperature Calibration**:
   - When a user indicates an outfit was "too hot" or "too cold", the warmth factors of involved items are adjusted.
   - The algorithm gradually learns the user's temperature comfort zone.

2. **Style Learning**:
   - Items frequently liked together develop higher cohesion scores.
   - This improves style matching for future suggestions.

3. **Preference Evolution**:
   - Individual item preference scores increase/decrease based on thumbs up/down.
   - Recently worn items get lower scores to encourage wardrobe rotation.

## Integration Points

To integrate the algorithm with the app's UI:

1. Connect to the clothing inventory database/storage
2. Link to the weather data service
3. Connect to the user's style preferences in SettingsContext
4. Implement UI for outfit display and feedback collection
5. Add persistent storage for updated clothing data with user preferences

## Testing

The `outfitAlgorithmTest.ts` file provides example functions for testing different scenarios:

- Warm weather outfits
- Cold/windy weather outfits
- Rainy day outfits
- Outfits with required items
- Style-specific outfits
- Feedback processing demonstration

Run these examples to verify the algorithm's behavior in different conditions.

## Future Enhancements

Possible extensions to the algorithm include:

1. Machine learning components for improved prediction
2. Calendar integration for context-aware suggestions
3. Color coordination scoring
4. Brand/designer matching
5. Activity-specific outfit optimization
