import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '@/styles';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { OutfitFeedback } from '@/types/Outfit';
import { useSubmitOutfitFeedbackMutation } from '@/hooks/queries/useOutfitFeedbackQuery';
import { useOutfit } from '@/contexts/OutfitContext';

interface FeedbackSectionProps {
  isVisible: boolean;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({ isVisible }) => {
  const { getCurrentDate, storedOutfit } = useOutfit();
  const submitFeedbackMutation = useSubmitOutfitFeedbackMutation();
  
  const [selectedRating, setSelectedRating] = useState<'thumbsUp' | 'thumbsDown' | null>(null);
  const [comment, setComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  
  // Reset state when outfit changes
  useEffect(() => {
    if (storedOutfit?.feedback) {
      setSelectedRating(storedOutfit.feedback.rating);
      setComment(storedOutfit.feedback.comment || '');
      setShowCommentInput(!!storedOutfit.feedback.comment);
    } else {
      setSelectedRating(null);
      setComment('');
      setShowCommentInput(false);
    }
  }, [storedOutfit]);
  
  if (!isVisible) return null;
  
  const handleRatingPress = async (rating: 'thumbsUp' | 'thumbsDown') => {
    if (storedOutfit?.feedback) {
      // Already has feedback, don't allow changes
      return;
    }
    
    setSelectedRating(rating);
    
    if (rating === 'thumbsDown') {
      setShowCommentInput(true);
    } else {
      // Submit immediately for thumbs up
      await submitFeedback(rating, '');
    }
  };
  
  const submitFeedback = async (rating: 'thumbsUp' | 'thumbsDown', feedbackComment: string) => {
    const feedback: OutfitFeedback = {
      rating,
      comment: feedbackComment || undefined,
      submittedAt: new Date()
    };
    
    try {
      await submitFeedbackMutation.mutateAsync({
        date: getCurrentDate(),
        feedback
      });
    } catch (error) {
      // Error handled by mutation
    }
  };
  
  const handleSubmitComment = async () => {
    if (!selectedRating) return;
    
    await submitFeedback(selectedRating, comment);
    setShowCommentInput(false);
  };
  
  const hasFeedback = !!storedOutfit?.feedback;
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>How was this outfit?</Text>
        {hasFeedback && (
          <Text style={styles.submittedText}>Feedback submitted</Text>
        )}
      </View>
      
      <View style={styles.ratingContainer}>
        <TouchableOpacity
          style={[
            styles.ratingButton,
            selectedRating === 'thumbsUp' && styles.ratingButtonSelected,
            hasFeedback && styles.ratingButtonDisabled
          ]}
          onPress={() => handleRatingPress('thumbsUp')}
          disabled={hasFeedback || submitFeedbackMutation.isPending}
        >
          <IconSymbol
            name="hand.thumbsup.fill"
            size={24}
            color={selectedRating === 'thumbsUp' ? theme.colors.success : theme.colors.gray}
          />
          <Text style={[
            styles.ratingText,
            selectedRating === 'thumbsUp' && styles.ratingTextSelected
          ]}>
            Good fit
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.ratingButton,
            selectedRating === 'thumbsDown' && styles.ratingButtonSelected,
            hasFeedback && styles.ratingButtonDisabled
          ]}
          onPress={() => handleRatingPress('thumbsDown')}
          disabled={hasFeedback || submitFeedbackMutation.isPending}
        >
          <IconSymbol
            name="hand.thumbsdown.fill"
            size={24}
            color={selectedRating === 'thumbsDown' ? theme.colors.error : theme.colors.gray}
          />
          <Text style={[
            styles.ratingText,
            selectedRating === 'thumbsDown' && styles.ratingTextSelected
          ]}>
            Not quite
          </Text>
        </TouchableOpacity>
      </View>
      
      {(showCommentInput || storedOutfit?.feedback?.comment) && (
        <View style={styles.commentSection}>
          {hasFeedback ? (
            <View style={styles.submittedComment}>
              <Text style={styles.commentLabel}>Your feedback:</Text>
              <Text style={styles.commentText}>{storedOutfit.feedback.comment}</Text>
            </View>
          ) : (
            <>
              <Text style={styles.commentLabel}>What could be better?</Text>
              <TextInput
                style={styles.commentInput}
                value={comment}
                onChangeText={setComment}
                placeholder="Too warm, too casual, etc..."
                placeholderTextColor={theme.colors.gray}
                multiline
                numberOfLines={3}
                editable={!submitFeedbackMutation.isPending}
              />
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  submitFeedbackMutation.isPending && styles.submitButtonDisabled
                ]}
                onPress={handleSubmitComment}
                disabled={submitFeedbackMutation.isPending}
              >
                {submitFeedbackMutation.isPending ? (
                  <ActivityIndicator size="small" color={theme.colors.white} />
                ) : (
                  <Text style={styles.submitButtonText}>Submit feedback</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.black,
  },
  submittedText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.success,
    fontStyle: 'italic',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'center',
  },
  ratingButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ratingButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  ratingButtonDisabled: {
    opacity: 0.6,
  },
  ratingText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.gray,
  },
  ratingTextSelected: {
    color: theme.colors.black,
  },
  commentSection: {
    marginTop: theme.spacing.lg,
  },
  commentLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.black,
    marginBottom: theme.spacing.sm,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.sm,
    color: theme.colors.black,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
  submittedComment: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
  },
  commentText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.black,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
});