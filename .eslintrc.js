module.exports = {
  parser: 'babel-eslint',
  root: true,
  extends: [
    'airbnb',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/babel',
    'prettier/react',
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
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],
    'prettier/prettier': ['error'],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.js',
          '**/*.test/index.js',
          'src/server/infra/tests/**/*.js',
        ],
      },
    ],
    'no-shadow': 'off',
    'import/namespace': ['error', { allowComputed: true }],
  },
};
