import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, View, type ImageSourcePropType, type ViewProps } from 'react-native';

export type ThemedCardProps = ViewProps & {
  variant?: 'default' | 'error' | 'info' | 'data' | 'warning';
  children: React.ReactNode;
  icon?: ImageSourcePropType | { type: 'MaterialIcons' | 'Ionicons'; name: string } | React.ReactNode;
};

export function ThemedCard({ variant = 'default', style, children, icon, ...rest }: ThemedCardProps) {
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
  const iconBackgroundColor = useThemeColor({}, 'cardData');
  const iconBorderColor = useThemeColor({}, 'cardDataBorder');
  const iconTintColor = useThemeColor({}, 'text');

  const variantStyles = {
    default: { backgroundColor: cardDefaultBg, borderColor: cardDefaultBorder },
    error: { backgroundColor: cardErrorBg, borderColor: cardErrorBorder },
    info: { backgroundColor: cardInfoBg, borderColor: cardInfoBorder },
    data: { backgroundColor: cardDataBg, borderColor: cardDataBorder },
    warning: { backgroundColor: cardWarningBg, borderColor: cardWarningBorder },
  };

  const renderIcon = () => {
    if (!icon) return null;

    // Check if it's an icon object with type
    if (typeof icon === 'object' && icon !== null && 'type' in icon && 'name' in icon) {
      const IconComponent = icon.type === 'MaterialIcons' ? MaterialIcons : Ionicons;
      return <IconComponent name={icon.name as any} size={50} color={iconTintColor} />;
    }

    // Check if it's an image source (number from require())
    if (typeof icon === 'number') {
      return <Image source={icon} style={[styles.icon, { tintColor: iconTintColor }]} contentFit="contain" cachePolicy="memory-disk" />;
    }

    // Otherwise render as React node
    return icon as React.ReactNode;
  };

  return (
    <ThemedView style={[styles.card, variantStyles[variant], style]} {...rest}>
      {icon ? (
        <View style={styles.container}>
          <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor, borderRightColor: iconBorderColor }]}>
            {renderIcon()}
          </View>
          <View style={styles.content}>
            {children}
          </View>
        </View>
      ) : (
        children
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  container: {
    flexDirection: 'row',
  },
  iconContainer: {
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    marginRight: 15,
    marginLeft: -15,
    marginTop: -15,
    marginBottom: -15,
    paddingVertical: 15,
  },
  icon: {
    width: 70,
    height: 70,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});
