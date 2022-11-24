/* eslint-env node */
const { defineConfig } = require('eslint-define-config')
module.exports = defineConfig({
  extends: ['zzjtnb'],
  ignorePatterns: ['!packages/server/types/*.d.ts'],
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
})
