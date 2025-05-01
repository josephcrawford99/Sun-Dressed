import * as Font from 'expo-font';
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import {
  LibreBaskerville_400Regular,
  LibreBaskerville_700Bold,
  LibreBaskerville_400Regular_Italic,
} from '@expo-google-fonts/libre-baskerville';

export const customFonts = {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold,
  LibreBaskerville_400Regular,
  LibreBaskerville_700Bold,
  LibreBaskerville_400Regular_Italic,
};

export const loadFonts = async () => {
  try {
    await Font.loadAsync(customFonts);
    return true;
  } catch (error) {
    console.error('Error loading fonts:', error);
    return false;
  }
};
