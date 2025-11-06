import { useThemeColor } from '@/hooks/use-theme-color';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';

export type ThemedBackgroundProps = SafeAreaViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedBackground({ style, lightColor, darkColor, ...otherProps }: ThemedBackgroundProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <SafeAreaView edges={['top','left','right']} style={[{ backgroundColor }, style]} {...otherProps} />;
}
