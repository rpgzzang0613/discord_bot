import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
    },
    rules: {
      'arrow-spacing': ['warn', {before: true, after: true}],
      'comma-dangle': ['error', 'always-multiline'],
      'comma-spacing': 'error',
      'comma-style': 'error',
      'dot-location': ['error', 'property'],
      'keyword-spacing': 'error',
      'no-floating-decimal': 'error',
      'no-inline-comments': 'error',
      'no-lonely-if': 'error',
      'no-multi-spaces': 'error',
      'no-multiple-empty-lines': ['error', {max: 2, maxEOF: 1, maxBOF: 0}],
      'no-shadow': ['error', {allow: ['err', 'resolve', 'reject']}],
      'no-undef': 'off',
      'space-before-blocks': 'error',
      'space-before-function-paren': [
        'error',
        {
          anonymous: 'never',
          named: 'never',
          asyncArrow: 'always',
        },
      ],
      'space-in-parens': 'error',
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',
      'spaced-comment': 'error',
      yoda: 'error',
    },
  },
  prettier,
];
