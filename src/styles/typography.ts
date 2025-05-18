import { TextStyle } from 'react-native';

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
    fontWeight: '500',
    fontSize: 60,
    letterSpacing: -3.5,
    textAlign: 'left',
    transform: [{ scaleY: 1.3 }],
    color: '#000',
  },
  heading: {
    fontFamily: fonts.primaryBold,
    fontWeight: '700',
    letterSpacing: -1.25,
    fontSize: 28,
    color: '#000',
  },
  headingItalic: {
    fontFamily: fonts.primaryItalic,
    fontStyle: 'italic',
    fontWeight: '400',
    letterSpacing: -1.25,
    fontSize: 28,
    color: '#000',
  },
  subheading: {
    fontFamily: fonts.secondaryBold,
    fontWeight: '600',
    fontSize: 18,
    color: '#000',
  },
  body: {
    fontFamily: fonts.secondary,
    fontWeight: '400',
    fontSize: 16,
    color: '#000',
  },
  label: {
    fontFamily: fonts.secondaryMedium,
    fontWeight: '500',
    fontSize: 14,
    color: '#757575',
  },
  button: {
    fontFamily: fonts.secondaryBold,
    fontWeight: '700',
    fontSize: 16,
    color: '#fff',
  },
  caption: {
    fontFamily: fonts.secondary,
    fontWeight: '400',
    fontSize: 12,
    color: '#757575',
  },
  tempButton: {
    fontFamily: fonts.primary,
    fontWeight: '400',
    fontSize: 18,
    color: '#FFF',
    letterSpacing: 0.5,
  },
};