const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'commonjs', globals: { ...globals.node, ...globals.browser } },
    rules: {
      eqeqeq: ['error', 'always'],
      'no-warning-comments': 'error',
      'no-inline-comments': 'error',
    },
  },
];
