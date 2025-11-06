import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet, type ViewProps } from 'react-native';

export type ThemedCardProps = ViewProps & {
  variant?: 'default' | 'error' | 'info' | 'data';
  children: React.ReactNode;
};

export function ThemedCard({ variant = 'default', style, children, ...rest }: ThemedCardProps) {
  const borderColor = useThemeColor({}, 'border');

  const variantStyles = {
    default: { backgroundColor: 'rgba(128, 128, 128, 0.05)', borderColor },
    error: { backgroundColor: 'rgba(255, 107, 107, 0.1)', borderColor: 'rgba(255, 107, 107, 0.3)' },
    info: { backgroundColor: 'rgba(10, 126, 164, 0.1)', borderColor: 'rgba(10, 126, 164, 0.3)' },
    data: { backgroundColor: 'rgba(128, 128, 128, 0.1)', borderColor },
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
});
