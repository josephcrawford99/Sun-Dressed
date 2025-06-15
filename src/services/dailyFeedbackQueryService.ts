import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyFeedbackState, Outfit, OutfitFeedback } from '@/types/Outfit';
import { OutfitStorageService } from './outfitStorageService';

const FEEDBACK_STATE_KEY = 'feedback_state';

export class DailyFeedbackQueryService {
  /**
   * Check if we should show the feedback modal
   * Returns outfit data and date if modal should be shown
   */
  static async shouldShowFeedbackModal(): Promise<{
    shouldShow: boolean;
    outfit?: Outfit;
    date?: string;
  }> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      // Get feedback state
      const state = await this.getFeedbackState();
      
      // Check if already prompted today
      if (state.lastPromptDate === today) {
        return { shouldShow: false };
      }
      
      // Check if yesterday's outfit exists
      const yesterdayOutfit = await OutfitStorageService.getOutfitByDate(new Date(yesterday));
      if (!yesterdayOutfit) {
        return { shouldShow: false };
      }
      
      // Check if feedback already exists for yesterday
      if (state.feedbackHistory[yesterday] || yesterdayOutfit.feedback) {
        return { shouldShow: false };
      }
      
      return {
        shouldShow: true,
        outfit: yesterdayOutfit.outfit,
        date: yesterday
      };
    } catch (error) {
      console.error('Error checking if should show feedback:', error);
      return { shouldShow: false };
    }
  }

  /**
   * Get the current feedback state
   */
  static async getFeedbackState(): Promise<DailyFeedbackState> {
    try {
      const stateJson = await AsyncStorage.getItem(FEEDBACK_STATE_KEY);
      if (stateJson) {
        return JSON.parse(stateJson);
      }
      return {
        lastPromptDate: '',
        feedbackHistory: {}
      };
    } catch (error) {
      console.error('Error loading feedback state:', error);
      return {
        lastPromptDate: '',
        feedbackHistory: {}
      };
    }
  }

  /**
   * Save feedback and update state
   */
  static async saveFeedback(feedback: Partial<OutfitFeedback>): Promise<DailyFeedbackState> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      // Get current state
      const state = await this.getFeedbackState();
      
      // Update state
      state.lastPromptDate = today;
      
      // Only save feedback if not dismissed
      if (!feedback.dismissed && feedback.submittedAt) {
        const completeFeedback: OutfitFeedback = {
          ...feedback,
          submittedAt: feedback.submittedAt
        } as OutfitFeedback;
        
        state.feedbackHistory[yesterday] = completeFeedback;
        
        // Also save to outfit storage for compatibility
        await OutfitStorageService.saveFeedbackForDate(new Date(yesterday), completeFeedback);
      }
      
      // Save updated state
      await AsyncStorage.setItem(FEEDBACK_STATE_KEY, JSON.stringify(state));
      
      return state;
    } catch (error) {
      console.error('Error saving feedback:', error);
      throw error;
    }
  }

  /**
   * Get feedback history for LLM context
   */
  static async getFeedbackHistory(limit: number = 10): Promise<{
    date: string;
    feedback: OutfitFeedback;
    outfit?: Outfit;
  }[]> {
    try {
      const state = await this.getFeedbackState();
      
      // Get entries and sort by date (newest first)
      const entries = Object.entries(state.feedbackHistory)
        .filter(([_, feedback]) => feedback.wasWorn && typeof feedback.rating === 'number')
        .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
        .slice(0, limit);
      
      // Load outfit data for each feedback
      const historyWithOutfits = await Promise.all(
        entries.map(async ([date, feedback]) => {
          const storedOutfit = await OutfitStorageService.getOutfitByDate(new Date(date));
          return {
            date,
            feedback,
            outfit: storedOutfit?.outfit || undefined
          };
        })
      );
      
      return historyWithOutfits;
    } catch (error) {
      console.error('Error loading feedback history:', error);
      return [];
    }
  }

  /**
   * Get aggregated feedback metrics for LLM context
   */
  static async getFeedbackMetrics(): Promise<{
    averageRating: number;
    totalRatings: number;
    highRatedCount: number;
    lowRatedCount: number;
    recentTrend: 'improving' | 'declining' | 'stable';
  } | null> {
    try {
      const history = await this.getFeedbackHistory(20);
      
      if (history.length === 0) {
        return null;
      }
      
      const numericRatings = history
        .filter(h => typeof h.feedback.rating === 'number')
        .map(h => h.feedback.rating as number);
      
      if (numericRatings.length === 0) {
        return null;
      }
      
      const averageRating = numericRatings.reduce((sum, r) => sum + r, 0) / numericRatings.length;
      const highRatedCount = numericRatings.filter(r => r >= 8).length;
      const lowRatedCount = numericRatings.filter(r => r <= 4).length;
      
      // Calculate trend from recent vs older ratings
      const recentCount = Math.min(5, numericRatings.length);
      const recentAvg = numericRatings.slice(0, recentCount).reduce((sum, r) => sum + r, 0) / recentCount;
      const olderAvg = numericRatings.length > recentCount
        ? numericRatings.slice(recentCount).reduce((sum, r) => sum + r, 0) / (numericRatings.length - recentCount)
        : recentAvg;
      
      let recentTrend: 'improving' | 'declining' | 'stable' = 'stable';
      if (recentAvg > olderAvg + 0.5) recentTrend = 'improving';
      else if (recentAvg < olderAvg - 0.5) recentTrend = 'declining';
      
      return {
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings: numericRatings.length,
        highRatedCount,
        lowRatedCount,
        recentTrend
      };
    } catch (error) {
      console.error('Error calculating feedback metrics:', error);
      return null;
    }
  }
}