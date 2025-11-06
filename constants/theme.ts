/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    border: '#ccc',
    tint: '#ffe052',
    icon: '#687076',
    iconTint: "#c4a827",
    cardDefault: 'rgba(128, 128, 128, 0.05)',
    cardDefaultBorder: 'rgba(128, 128, 128, 0.2)',
    cardError: 'rgba(255, 107, 107, 0.1)',
    cardErrorBorder: 'rgba(255, 107, 107, 0.3)',
    cardInfo: 'rgba(254, 208, 0, 0.15)',
    cardInfoBorder: 'rgba(254, 208, 0, 0.4)',
    cardData: 'rgba(128, 128, 128, 0.1)',
    cardDataBorder: 'rgba(128, 128, 128, 0.2)',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    border: '#444',
    tint: '#ef8b6e',
    icon: '#9BA1A6',
    iconTint: '#9BA1A6',
    cardDefault: 'rgba(128, 128, 128, 0.1)',
    cardDefaultBorder: 'rgba(128, 128, 128, 0.3)',
    cardError: 'rgba(255, 107, 107, 0.15)',
    cardErrorBorder: 'rgba(255, 107, 107, 0.4)',
    cardInfo: 'rgba(239, 139, 110, 0.2)',
    cardInfoBorder: 'rgba(239, 139, 110, 0.5)',
    cardData: 'rgba(128, 128, 128, 0.15)',
    cardDataBorder: 'rgba(128, 128, 128, 0.3)',
  },
};

export const Fonts = {
  /** Montserrat variable font for body text and general use */
  body: 'Montserrat',
  /** Montserrat italic for emphasized body text */
  bodyItalic: 'Montserrat-Italic',
  /** Libre Baskerville italic for titles and large text */
  title: 'LibreBaskerville-Italic',
  /** Libre Baskerville bold for bold title variants */
  titleBold: 'LibreBaskerville-Bold',
};

export const Shadows = {
  stickyHeader: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
};
