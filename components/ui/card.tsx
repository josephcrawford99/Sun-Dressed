import { StyleSheet, type ViewProps } from 'react-native';

import { ThemedView } from '@/components/themed-view';

export type ThemedCardProps = ViewProps & {
  variant?: 'default' | 'error' | 'info' | 'data';
  children: React.ReactNode;
};

export function ThemedCard({ variant = 'default', style, children, ...rest }: ThemedCardProps) {
  const variantStyles = {
    default: styles.cardDefault,
    error: styles.cardError,
    info: styles.cardInfo,
    data: styles.cardData,
  };

  return (
    <ThemedView style={[styles.card, variantStyles[variant], style]} {...rest}>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  cardDefault: {
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
    borderColor: 'rgba(128, 128, 128, 0.15)',
  },
  cardError: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderColor: 'rgba(255, 107, 107, 0.2)',
  },
  cardInfo: {
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    borderColor: 'rgba(10, 126, 164, 0.2)',
  },
  cardData: {
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderColor: 'rgba(128, 128, 128, 0.2)',
  },
});
