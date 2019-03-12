const path = require('path');

const root = process.env.PWD;
const rootServer = './src/server';

module.exports = (env) => ({
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: true },
        useBuiltIns: 'usage',
        forceAllTransforms: env === 'production',
        // forceAllTransforms: false,
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
          '@config': './config',
          '@container': `${rootServer}/container`,
          '@app': `${rootServer}/app`,
          '@domain': `${rootServer}/domain`,
          '@infra': `${rootServer}/infra`,
          '@interfaces': `${rootServer}/interfaces`,
        },
      },
    ],
  ],
});
