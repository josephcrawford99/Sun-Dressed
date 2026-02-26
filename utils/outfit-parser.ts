import { Outfit, ClothingItem } from '@/types/outfit';
import { getItemsList } from '@/constants/clothing-icons';
import { useStore } from '@/store/store';

/**
 * Parses a text response from the AI into a structured Outfit
 *
 * Handles:
 * - JSON wrapped in markdown code blocks (```json...```)
 * - Plain JSON
 * - Validates the structure has required fields
 *
 * @param text - Raw text response from the AI API
 * @returns Parsed and validated Outfit
 * @throws Error if text is not valid JSON or missing required fields
 */
export function parseOutfitJSON(text: string): Outfit {
  let jsonText = text.trim();

  // Strip markdown code blocks if present
  const codeBlockMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonText = codeBlockMatch[1].trim();
  }

  // Parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Validate structure
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Parsed JSON is not an object');
  }

  const obj = parsed as Record<string, unknown>;

  // Validate items array
  if (!Array.isArray(obj.items)) {
    throw new Error('Missing or invalid "items" array in response');
  }

  // Get user's style preference from store for validation
  const userStyle = useStore.getState().style;
  const allowedItemNames = getItemsList(userStyle);

  // Validate and construct items array
  const items: ClothingItem[] = [];
  for (let i = 0; i < obj.items.length; i++) {
    const item = obj.items[i];
    if (typeof item !== 'object' || item === null) {
      throw new Error(`Item at index ${i} is not an object`);
    }

    const itemObj = item as Record<string, unknown>;

    if (typeof itemObj.name !== 'string') {
      throw new Error(`Item at index ${i} missing or invalid "name" field`);
    }
    // Validate that the item name is in the allowed list for this user's style
    if (!allowedItemNames.includes(itemObj.name)) {
      throw new Error(`Item "${itemObj.name}" at index ${i} is not in the allowed clothing items list. LLM must only use items from the provided list.`);
    }
    if (typeof itemObj.blurb !== 'string') {
      throw new Error(`Item at index ${i} missing or invalid "blurb" field`);
    }

    // Construct validated ClothingItem
    items.push({
      name: itemObj.name,
      blurb: itemObj.blurb,
    });
  }

  // Validate overallDescription
  if (typeof obj.overallDescription !== 'string') {
    throw new Error('Missing or invalid "overallDescription" field in response');
  }

  // Validate warmCoatRecommended
  if (typeof obj.warmCoatRecommended !== 'boolean') {
    throw new Error('Missing or invalid "warmCoatRecommended" field in response');
  }

  // Validate rainGearRecommended
  if (typeof obj.rainGearRecommended !== 'boolean') {
    throw new Error('Missing or invalid "rainGearRecommended" field in response');
  }

  // Return properly typed object constructed from validated data
  return {
    items,
    overallDescription: obj.overallDescription,
    warmCoatRecommended: obj.warmCoatRecommended,
    rainGearRecommended: obj.rainGearRecommended,
  };
}
