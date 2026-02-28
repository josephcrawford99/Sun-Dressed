import { getAllowedItemNames } from '@/constants/clothing-items';
import { useStore } from '@/store/store';
import { Trip } from '@/types/trip';

/**
 * Builds a structured prompt for trip packing list generation.
 * Reads style and tempFormat from the store internally.
 *
 * @param trip - The trip to generate a packing plan for
 * @returns Structured prompt string to send to Gemini API
 */
export function buildTripPrompt(trip: Trip): string {
  const { tempFormat } = useStore.getState();

  const tempSymbol = tempFormat === 'metric' ? '°C' : '°F';

  // Calculate trip duration
  const days = Math.ceil(
    (trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  // Format dates for the prompt
  const startStr = trip.startDate.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
  const endStr = trip.endDate.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  const allowedItems = getAllowedItemNames();

  return `You are a travel packing advisor. Based on the destination, dates, and activities, estimate the weather conditions and create a packing list.

TRIP DETAILS:
- Destination: ${trip.destination}
- Dates: ${startStr} to ${endStr}
- Duration: ${days} day(s)
- Planned Activities: ${trip.activities || 'general sightseeing and exploring'}

ALLOWED CLOTHING ITEMS:
You MUST ONLY suggest items from this list. Do not suggest any items not on this list:
${allowedItems.join(', ')}

IMPORTANT: Item names in your response must match EXACTLY as shown above, including any text in parentheses.

Respond with ONLY valid JSON in this exact format. Do not include any other text, explanations, or markdown formatting outside the JSON.

Required JSON format:
{
  "weatherTags": ["keyword1", "keyword2"],
  "packingList": [
    {
      "name": "Exact item name from ALLOWED CLOTHING ITEMS list",
      "quantity": number,
      "notes": "Brief explanation of why this item was suggested for this trip"
    }
  ],
  "packingSummary": "A friendly 2-3 sentence summary of the overall packing strategy"
}

WEATHER TAGS: Provide 2-4 weather keyword tags that describe the expected conditions at ${trip.destination} during this time of year. Use simple lowercase keywords like "warm", "hot", "cold", "mild", "rainy", "humid", "dry", "windy", "snowy", "sunny", "cloudy", "foggy". Include only the most relevant tags.

PACKING LIST: Suggest practical quantities based on the trip duration and expected weather. Temperatures should be in ${tempSymbol}. Consider layering for variable conditions. Keep the list focused and practical.`;
}