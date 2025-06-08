module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './',
            '@src': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@services': './src/services',
            '@types': './src/types',
            '@utils': './src/utils',
            '@contexts': './src/contexts',
            '@styles': './src/styles',
            '@hooks': './src/hooks',
            '@navigation': './src/navigation',
            '@config': './src/config',
            '@data': './src/data',
            '@test': './src/test'
          }
        }
      ]
    ]
  };
};