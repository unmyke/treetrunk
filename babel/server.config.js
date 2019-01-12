const getConfig = require('./getConfig');

const config = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        modules: false,
        useBuiltIns: 'usage',
      },
    ],
  ],

  plugins: [
    //   '@babel/plugin-transform-modules-commonjs',
    //   '@babel/plugin-transform-runtime',
    //   // Stage 0
    //   '@babel/plugin-proposal-function-bind',
    //   // Stage 1
    //   '@babel/plugin-proposal-export-default-from',
    //   '@babel/plugin-proposal-logical-assignment-operators',
    //   ['@babel/plugin-proposal-optional-chaining', { loose: false }],
    //   ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
    //   ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: false }],
    //   '@babel/plugin-proposal-do-expressions',
    //   // Stage 2
    //   ['@babel/plugin-proposal-decorators', { legacy: true }],
    //   '@babel/plugin-proposal-function-sent',
    //   '@babel/plugin-proposal-export-namespace-from',
    //   '@babel/plugin-proposal-numeric-separator',
    //   '@babel/plugin-proposal-throw-expressions',
    //   // Stage 3
    //   '@babel/plugin-syntax-dynamic-import',
    //   '@babel/plugin-syntax-import-meta',
    // ['@babel/plugin-proposal-class-properties', { loose: false }],
    //   '@babel/plugin-proposal-json-strings',
  ],
};

module.exports = getConfig(config);