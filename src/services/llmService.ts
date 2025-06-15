import { OutfitLLMService } from './llm/OutfitLLMService';
import { PackingListLLMService } from './llm/PackingListLLMService';
import { Outfit } from '../types/Outfit';
import { Weather } from '../types/weather';
import { StylePreference } from '../types/settings';

// Create singleton instances
const outfitService = new OutfitLLMService();
const packingListService = new PackingListLLMService();

/**
 * Generate outfit recommendations using LLM
 * This is a facade function that maintains backwards compatibility
 */
export const generateOutfitLLM = async (
  weather?: Weather,
  activity?: string,
  stylePreference?: StylePreference
): Promise<Outfit> => {
  return outfitService.generateOutfit(weather, activity, stylePreference);
};

/**
 * Generate packing list using LLM
 * This is a facade function that maintains backwards compatibility
 */
export const generatePackingListLLM = async (
  location: string,
  startDate: Date,
  endDate: Date,
  weatherData?: Weather[],
  stylePreference?: StylePreference
): Promise<string[]> => {
  return packingListService.generatePackingList(
    location,
    startDate,
    endDate,
    weatherData,
    stylePreference
  );
};