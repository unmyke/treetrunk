module.exports = {
  parser: 'babel-eslint',
  root: true,
  extends: ['plugin:prettier/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2017,
  },
  rules: {
    'no-console': 'off',
    'comma-dangle': 'off',
    'comma-spacing': ['error', { before: false, after: true }],
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],
    'prettier/prettier': ['error'],
  },
};
