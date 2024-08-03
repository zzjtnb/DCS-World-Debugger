export default {
  extends: [
    'stylelint-config-zzjtnb',
  ],
  rules: {
    'selector-class-pattern': ['^(?!.*--).*'],
  },
  ignoreFiles: [
    '**/dist/**/*',
    '**/**/stats.html',
  ],
}
