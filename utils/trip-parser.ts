import { getAllowedItemNames, mapResponseToItem } from '@/constants/clothing-items';
import { PackingItem, TripPlan } from '@/types/trip';

/**
 * Parses a text response from the AI into a structured TripPlan.
 *
 * Handles:
 * - JSON wrapped in markdown code blocks
 * - Plain JSON
 * - Validates structure and resolves categories/icons from CLOTHING_ITEMS
 *
 * @param text - Raw text response from the AI API
 * @returns Parsed and validated TripPlan
 * @throws Error if text is not valid JSON or missing required fields
 */
export function parseTripPlanJSON(text: string): TripPlan {
  let jsonText = text.trim();

  // Strip markdown code blocks if present
  const codeBlockMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonText = codeBlockMatch[1].trim();
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    throw new Error(`Failed to parse trip plan JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Parsed JSON is not an object');
  }

  const obj = parsed as Record<string, unknown>;

  // Validate weatherTags
  if (!Array.isArray(obj.weatherTags)) {
    throw new Error('Missing or invalid "weatherTags" array');
  }
  const weatherTags: string[] = obj.weatherTags.map((tag: unknown, i: number) => {
    if (typeof tag !== 'string') {
      throw new Error(`Weather tag at index ${i} is not a string`);
    }
    return tag.toLowerCase();
  });

  // Validate packingList
  if (!Array.isArray(obj.packingList)) {
    throw new Error('Missing or invalid "packingList" array');
  }

  const allowedNames = getAllowedItemNames();

  const packingList: PackingItem[] = obj.packingList.map((item: unknown, i: number) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`Packing item at index ${i} is not an object`);
    }

    const itemObj = item as Record<string, unknown>;

    if (typeof itemObj.name !== 'string') {
      throw new Error(`Packing item at index ${i}: missing "name"`);
    }
    if (!allowedNames.includes(itemObj.name)) {
      throw new Error(`Packing item "${itemObj.name}" at index ${i} is not in the allowed clothing items list`);
    }
    if (typeof itemObj.quantity !== 'number') {
      throw new Error(`Packing item at index ${i}: missing "quantity"`);
    }
    if (typeof itemObj.notes !== 'string') {
      throw new Error(`Packing item at index ${i}: missing "notes"`);
    }

    // Resolve metadata from CLOTHING_ITEMS
    const matched = mapResponseToItem(itemObj.name);
    if (!matched) {
      throw new Error(`Packing item "${itemObj.name}" at index ${i} could not be matched to a known clothing item`);
    }

    return {
      ...matched,
      quantity: itemObj.quantity,
      notes: itemObj.notes,
    };
  });

  // Validate packingSummary
  if (typeof obj.packingSummary !== 'string') {
    throw new Error('Missing or invalid "packingSummary"');
  }

  return { weatherTags, packingList, packingSummary: obj.packingSummary };
}
