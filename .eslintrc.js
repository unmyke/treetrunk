module.exports = {
  parser: 'babel-eslint',
  root: true,
  extends: [
    'airbnb',
    'plugin:prettier/recommended',
    'prettier',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  parserOptions: {
    ecmaVersion: 2017,
  },
  rules: {
    'no-console': 'off',
    'comma-dangle': 'off',
    'react/jsx-filename-extension': 'off',
    'comma-spacing': ['error', { before: false, after: true }],
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],
    'prettier/prettier': ['error'],
  },
};
