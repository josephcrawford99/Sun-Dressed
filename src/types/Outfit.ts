export interface Outfit {
  top: string;
  bottom?: string;
  outerwear?: string[];
  accessories?: string[];
  shoes: string;
  explanation: string;
}

export interface OutfitFeedback {
  rating: 'thumbsUp' | 'thumbsDown' | number; // Support both legacy and numeric ratings
  wasWorn?: boolean; // New field for daily feedback
  comment?: string;
  submittedAt: Date;
  dismissed?: boolean; // Track if user dismissed without providing feedback
}

export interface DailyFeedbackState {
  lastPromptDate: string; // YYYY-MM-DD format
  feedbackHistory: Record<string, OutfitFeedback>; // Keyed by date
}

export interface OutfitWithFeedback extends Outfit {
  feedback?: OutfitFeedback;
}