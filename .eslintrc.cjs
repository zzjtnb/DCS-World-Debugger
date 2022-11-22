/* eslint-env node */
const { defineConfig } = require('eslint-define-config')
module.exports = defineConfig({
  root: true,
  extends: [
    'zzjtnb/vue',
  ],
  ignorePatterns: [],
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
})
