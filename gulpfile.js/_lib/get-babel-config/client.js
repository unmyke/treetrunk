module.exports = (env) => ({
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { browsers: '> 0.25%, not dead' },
        useBuiltIns: 'usage',
        debug: env === 'development',
        forceAllTransforms: env === 'production',
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
    ['@babel/plugin-proposal-class-properties', { loose: false }],
  ],
});
