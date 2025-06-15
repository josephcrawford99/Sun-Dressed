import { OutfitStorageService } from './outfitStorageService';
import { OutfitFeedback } from '../types/Outfit';

/**
 * Service layer for outfit feedback operations using TanStack Query patterns
 */
export class OutfitFeedbackQueryService {
  /**
   * Submit feedback for an outfit on a specific date
   */
  static async submitFeedback(date: Date, feedback: OutfitFeedback): Promise<void> {
    try {
      await OutfitStorageService.saveFeedbackForDate(date, feedback);
    } catch (error) {
      throw new Error(`Failed to submit feedback: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get feedback for an outfit on a specific date
   */
  static async getFeedbackForDate(date: Date): Promise<OutfitFeedback | null> {
    try {
      const storedOutfit = await OutfitStorageService.getOutfitByDate(date);
      return storedOutfit?.feedback || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get all outfits with feedback
   */
  static async getOutfitsWithFeedback(): Promise<{ date: string; feedback: OutfitFeedback }[]> {
    try {
      const allOutfits = await OutfitStorageService.getAllOutfits();
      return Object.entries(allOutfits)
        .filter(([_, outfit]) => outfit.feedback)
        .map(([date, outfit]) => ({
          date,
          feedback: outfit.feedback!
        }));
    } catch (error) {
      return [];
    }
  }
}