module.exports = {
  env: {
    es6: true,
    node: true,
  },
  overrides: [],
  parser: '',
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-constant-condition': ['error', { checkLoops: false }],
  },
  globals: {},
};
