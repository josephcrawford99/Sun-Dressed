// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const tanstackQueryPlugin = require('@tanstack/eslint-plugin-query');

module.exports = defineConfig([
  expoConfig,
  ...tanstackQueryPlugin.configs['flat/recommended'],
  {
    ignores: ['dist/*'],
  },
]);
