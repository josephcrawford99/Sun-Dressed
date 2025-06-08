module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          // extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@styles': './src/styles',
            '@hooks': './src/hooks',
            '@/types': './src/types',
            '@services': './src/services',
            '@assets': './src/assets',
            '@utils': './src/utils',
            '@components': './src/components',
            '@app': './src/app',
            '@contexts': './src/contexts',
            '@config': './src/config',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ]
  };
};