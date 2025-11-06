import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet, type ViewProps } from 'react-native';

export type ThemedCardProps = ViewProps & {
  variant?: 'default' | 'error' | 'info' | 'data' | 'warning';
  children: React.ReactNode;
};

export function ThemedCard({ variant = 'default', style, children, ...rest }: ThemedCardProps) {
  const cardDefaultBg = useThemeColor({}, 'cardDefault');
  const cardDefaultBorder = useThemeColor({}, 'cardDefaultBorder');
  const cardErrorBg = useThemeColor({}, 'cardError');
  const cardErrorBorder = useThemeColor({}, 'cardErrorBorder');
  const cardInfoBg = useThemeColor({}, 'cardInfo');
  const cardInfoBorder = useThemeColor({}, 'cardInfoBorder');
  const cardDataBg = useThemeColor({}, 'cardData');
  const cardDataBorder = useThemeColor({}, 'cardDataBorder');
  const cardWarningBg = useThemeColor({}, 'cardWarning');
  const cardWarningBorder = useThemeColor({}, 'cardWarningBorder');

  const variantStyles = {
    default: { backgroundColor: cardDefaultBg, borderColor: cardDefaultBorder },
    error: { backgroundColor: cardErrorBg, borderColor: cardErrorBorder },
    info: { backgroundColor: cardInfoBg, borderColor: cardInfoBorder },
    data: { backgroundColor: cardDataBg, borderColor: cardDataBorder },
    warning: { backgroundColor: cardWarningBg, borderColor: cardWarningBorder },
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
