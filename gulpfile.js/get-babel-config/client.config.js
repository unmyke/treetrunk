module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { browsers: '> 0.25%, not dead' },
      },
    ],
    '@babel/preset-react',
  ],

  plugins: ['@babel/plugin-transform-modules-commonjs'],
};
