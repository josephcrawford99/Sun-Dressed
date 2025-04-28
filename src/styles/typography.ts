import { TextStyle } from 'react-native';

export const fonts = {
  primary: 'LibreBaskerville_400Regular_Italic', // For branding, logo, special headings
  primaryBold: 'LibreBaskerville_700Bold',
  secondary: 'Montserrat_400Regular',     // For body, buttons, labels, etc.
  secondaryMedium: 'Montserrat_500Medium',
  secondaryBold: 'Montserrat_700Bold',
};

export const typography: { [key: string]: TextStyle } = {
  logo: {
    fontFamily: fonts.primary,
    fontStyle: 'italic',
    fontWeight: '500',
    fontSize: 60,
    letterSpacing: -2,
    textAlign: 'left',
    transform: [{ scaleY: 1.3 }],
    color: '#000',
  },
  heading: {
    fontFamily: fonts.primaryBold,
    fontWeight: '700',
    fontSize: 28,
    color: '#000',
  },
  subheading: {
    fontFamily: fonts.secondaryBold,
    fontWeight: '600',
    fontSize: 20,
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
};
