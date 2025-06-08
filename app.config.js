export default {
  expo: {
    name: "Sun Dressed",
    slug: "sun-dressed",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "sun-dressed",
    experiments: {
      typedRoutes: true,
    },
    // icon: "./src/assets/icon.png",
    userInterfaceStyle: "light",
    plugins: [
      "expo-font"
    ],
    // splash: {
    //   image: "./src/assets/splash.png",
    //   resizeMode: "contain",
    //   backgroundColor: "#ffffff"
    // },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.sundressed.app"
    },
    android: {
      // adaptiveIcon: {
      //   foregroundImage: "./src/assets/adaptive-icon.png",
      //   backgroundColor: "#ffffff"
      // },
      package: "com.sundressed.app"
    },
    web: {
      bundler: "metro",
      // favicon: "./src/assets/icon.png"
    },
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      openWeatherApiKey: process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY,
      googlePlacesApiKey: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
      geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
    }
  }
};