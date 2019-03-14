const path = require('path');

const root = process.env.PWD;
const rootServer = path.resolve(root, 'dist/server');
console.log(rootServer);

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
    // [
    //   'module-resolver',
    //   {
    //     rootServer,
    //     alias: {
    //       '@common': path.resolve(rootServer, '../common'),
    //       '@container': path.resolve(rootServer, 'container'),
    //       '@app': path.resolve(rootServer, 'app'),
    //       '@domain': path.resolve(rootServer, 'domain'),
    //       '@infra': path.resolve(rootServer, 'infra'),
    //       '@interfaces': path.resolve(rootServer, 'interfaces'),
    //     },
    //   },
    // ],
  ],
});
