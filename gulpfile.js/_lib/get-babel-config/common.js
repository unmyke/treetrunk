const root = process.env.PWD;
const rootServer = './dist/server';

module.exports = (env) => ({
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: true },
        useBuiltIns: 'usage',
        forceAllTransforms: env === 'production',
        debug: env === 'development',
        modules: 'auto',
      },
    ],
  ],

  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: false }],
    [
      'module-resolver',
      {
        root,
        alias: {
          '@domain': `${rootServer}/domain`,
        },
      },
    ],
  ],
});
