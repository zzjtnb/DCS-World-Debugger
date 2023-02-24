/* eslint-env node */
const { defineConfig } = require('eslint-define-config')
module.exports = defineConfig({
  extends: ['zzjtnb'],
  ignorePatterns: ['!packages/server/types/*.d.ts'],
  rules: {

  },
})
