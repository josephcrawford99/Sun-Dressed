import { TextStyle } from 'react-native';
import { theme } from './theme';

export const fonts = {
  primary: 'LibreBaskerville_400Regular',
  primaryItalic: 'LibreBaskerville_400Regular_Italic',
  primaryBold: 'LibreBaskerville_700Bold',
  secondary: 'Montserrat_400Regular',
  secondaryMedium: 'Montserrat_500Medium',
  secondaryBold: 'Montserrat_700Bold',
};

export const typography: { [key: string]: TextStyle } = {
  logo: {
    fontFamily: fonts.primaryItalic,
    fontStyle: 'italic',
    fontWeight: '600',
    fontSize: 60,
    letterSpacing: -3.5,
    textAlign: 'left',
    transform: [{ scaleY: 1.3 }],
    color: theme.colors.black,
  },
  heading: {
    fontFamily: fonts.primaryBold,
    fontWeight: '700',
    letterSpacing: -1.25,
    fontSize: 28,
    color: theme.colors.black,
  },
  headingItalic: {
    fontFamily: fonts.primaryItalic,
    fontStyle: 'italic',
    fontWeight: '600',
    letterSpacing: -1.25,
    fontSize: 28,
    color: theme.colors.black,
  },
  subheading: {
    fontFamily: fonts.secondaryBold,
    fontWeight: '600',
    fontSize: 18,
    color: theme.colors.black,
  },
  body: {
    fontFamily: fonts.secondary,
    fontWeight: '400',
    fontSize: 16,
    color: theme.colors.black,
  },
  label: {
    fontFamily: fonts.secondaryMedium,
    fontWeight: '500',
    fontSize: 14,
    color: theme.colors.gray,
  },
  button: {
    fontFamily: fonts.secondaryBold,
    fontWeight: '700',
    fontSize: 16,
    color: theme.colors.white,
  },
  
  caption: {
    fontFamily: fonts.secondary,
    fontWeight: '400',
    fontSize: 12,
    color: theme.colors.gray,
  },
  placeholderText: {
    fontSize: 18,
    color: theme.colors.gray,
    fontFamily: fonts.secondary,
    fontStyle: 'italic',
  },
  tempButton: {
    fontFamily: fonts.primary,
    fontWeight: '400',
    fontSize: 24,
    color: theme.colors.white,
    letterSpacing: 0.5,
  },
};