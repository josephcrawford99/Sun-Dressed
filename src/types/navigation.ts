/**
 * Navigation types for the Sun Dressed app
 */
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Location: { returnTo?: keyof RootStackParamList };
  Account: undefined;
  WeatherDetails: { date: string };
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Outfits: undefined;
  OutfitDetails: { outfitId: string };
  CreateOutfit: undefined;
};

// Export typed navigation props
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;
export type LocationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Location'>;
export type AccountScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Account'>;
export type WeatherDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WeatherDetails'>;
export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
export type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;
export type ForgotPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ForgotPassword'>;
export type OutfitsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Outfits'>;
export type OutfitDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OutfitDetails'>;
export type CreateOutfitScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateOutfit'>;

// Export typed route props
export type LocationScreenRouteProp = RouteProp<RootStackParamList, 'Location'>;
export type WeatherDetailsScreenRouteProp = RouteProp<RootStackParamList, 'WeatherDetails'>;
export type OutfitDetailsScreenRouteProp = RouteProp<RootStackParamList, 'OutfitDetails'>;
