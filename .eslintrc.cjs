module.exports = {
  env: {
    es6: true,
    node: true,
  },
  overrides: [],
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-constant-condition': ['error', { checkLoops: false }],
  },
  globals: {},
};
