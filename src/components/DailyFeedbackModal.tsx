import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  Platform
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/styles';
import { BentoBox } from '@/components/BentoBox';
import { Outfit, OutfitFeedback } from '@/types/Outfit';

interface DailyFeedbackModalProps {
  visible: boolean;
  outfit: Outfit | null;
  date: string;
  onClose: () => void;
  onSubmit: (feedback: Partial<OutfitFeedback>) => void;
}

export const DailyFeedbackModal: React.FC<DailyFeedbackModalProps> = ({
  visible,
  outfit,
  date,
  onClose,
  onSubmit
}) => {
  const [step, setStep] = useState<'ask-worn' | 'ask-rating'>('ask-worn');
  const [rating, setRating] = useState(5);

  const handleWornResponse = (wasWorn: boolean) => {
    if (!wasWorn) {
      onSubmit({ 
        date,
        wasWorn: false, 
        dismissed: false,
        submittedAt: new Date()
      });
      onClose();
      setStep('ask-worn'); // Reset for next time
    } else {
      setStep('ask-rating');
    }
  };

  const handleRatingSubmit = () => {
    onSubmit({ 
      date,
      wasWorn: true, 
      rating, 
      dismissed: false,
      submittedAt: new Date()
    });
    onClose();
    setStep('ask-worn'); // Reset for next time
    setRating(5); // Reset rating
  };

  const handleDismiss = () => {
    onSubmit({ 
      date,
      dismissed: true,
      submittedAt: new Date()
    });
    onClose();
    setStep('ask-worn'); // Reset for next time
  };

  if (!outfit) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleDismiss}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.backdrop}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Yesterday&apos;s Outfit</Text>
              <TouchableOpacity 
                onPress={handleDismiss}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={theme.colors.gray} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              {step === 'ask-worn' ? (
                <>
                  <Text style={styles.dateText}>{formatDate(date)}</Text>
                  <Text style={styles.question}>Did you wear this outfit?</Text>
                  
                  {/* Show the outfit */}
                  <View style={styles.outfitContainer}>
                    <BentoBox 
                      outfit={outfit}
                      loading={false}
                      error={null}
                      showNoOutfit={false}
                    />
                  </View>

                  {/* Response buttons */}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.button, styles.secondaryButton]}
                      onPress={() => handleWornResponse(false)}
                    >
                      <Text style={styles.secondaryButtonText}>No, I wore something else</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.button, styles.primaryButton]}
                      onPress={() => handleWornResponse(true)}
                    >
                      <Text style={styles.primaryButtonText}>Yes, I wore it</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.question}>How would you rate this outfit?</Text>
                  
                  {/* Rating display */}
                  <View style={styles.ratingDisplay}>
                    <Text style={styles.ratingNumber}>{rating}</Text>
                    <Text style={styles.ratingLabel}>out of 10</Text>
                  </View>

                  {/* Slider */}
                  <View style={styles.sliderContainer}>
                    <Text style={styles.sliderLabel}>1</Text>
                    <Slider
                      style={styles.slider}
                      minimumValue={1}
                      maximumValue={10}
                      step={1}
                      value={rating}
                      onValueChange={setRating}
                      minimumTrackTintColor={theme.colors.primary}
                      maximumTrackTintColor={theme.colors.border}
                      thumbTintColor={theme.colors.primary}
                    />
                    <Text style={styles.sliderLabel}>10</Text>
                  </View>

                  {/* Rating guidance */}
                  <View style={styles.ratingGuide}>
                    <Text style={styles.guideText}>
                      1-3: Poor fit or uncomfortable{'\n'}
                      4-6: Okay, but could be better{'\n'}
                      7-8: Good choice{'\n'}
                      9-10: Perfect outfit
                    </Text>
                  </View>

                  {/* Submit button */}
                  <TouchableOpacity
                    style={[styles.button, styles.primaryButton, styles.submitButton]}
                    onPress={handleRatingSubmit}
                  >
                    <Text style={styles.primaryButtonText}>Submit Rating</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.black,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  scrollView: {
    paddingHorizontal: theme.spacing.lg,
  },
  dateText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  question: {
    fontSize: theme.fontSize.xl,
    fontWeight: '600',
    color: theme.colors.black,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  outfitContainer: {
    marginBottom: theme.spacing.xl,
  },
  buttonRow: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: theme.colors.black,
    fontSize: theme.fontSize.md,
    fontWeight: '500',
  },
  ratingDisplay: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  ratingNumber: {
    fontSize: 64,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  ratingLabel: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.gray,
    marginTop: -theme.spacing.sm,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: theme.spacing.md,
  },
  sliderLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.gray,
  },
  ratingGuide: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.xl,
  },
  guideText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    lineHeight: 20,
  },
  submitButton: {
    marginBottom: theme.spacing.xl,
  },
});