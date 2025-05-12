const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for all file types
config.resolver.assetExts.push(
  // Images
  'jpeg',
  'jpg',
  'png',
  'gif',
  'webp',
  // Fonts
  'ttf',
  'otf',
  'woff',
  'woff2',
  'eot',
  // Other
  'mp4',
  'webm',
  'wav',
  'mp3',
  'json',
  'm4v',
  'svg'
);

// Handle SVG files
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

// Ensure proper source extensions
config.resolver.sourceExts = [
  'js',
  'jsx',
  'json',
  'ts',
  'tsx',
  'cjs',
  'mjs',
  'web.js',
  'web.jsx',
  'web.ts',
  'web.tsx'
];

module.exports = config;
