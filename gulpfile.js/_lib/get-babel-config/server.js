const path = require('path');

const root = path.resolve(process.env.PWD);
const rootServer = 'dist/server';
console.log(rootServer);
console.log(path.resolve(root, 'dist/common'));

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
          '@common': ([, name]) => path.resolve(root, './dist/common'),
          '@container': ([, name]) => path.resolve(rootServer, './container'),
          '@app': ([, name]) => path.resolve(rootServer, './app'),
          '@domain': ([, name]) => path.resolve(rootServer, './domain'),
          '^@infra/+(.*)$': ([, name]) =>
            path.resolve(rootServer, './infra', name),
          '^@interfaces/+(.*)$': ([, name]) =>
            path.resolve(rootServer, './interfaces', name),
        },
      },
    ],
  ],
});
