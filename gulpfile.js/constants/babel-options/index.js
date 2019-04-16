const merge = require('./babel-merge');
const getModuleResolvers = require('./get-module-resolvers');

const {
  envs: { DEV, PROD, TEST },
  targets: { SERVER, CLIENT, COMMON },
} = require('../types');

const commonOpts = {
  exclude: /.*\.test\.js/,
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        useBuiltIns: 'usage',
        corejs: { version: 3, proposals: true, debug: false },
      },
    ],
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-modules-commonjs',
  ],
};

const prodOpts = {
  presets: [['@babel/preset-env', { forceAllTransforms: true }]],
};

const devOpts = {
  exclude: [],
  presets: [['@babel/preset-env', { debug: true }]],
  // plugins: []
};

const devClientOpts = {
  plugins: ['react-hot-loader/babel'],
};

const clientOpts = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { browsers: '> 0.25%, not dead' },
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    'lodash',
    '@babel/plugin-transform-modules-commonjs',
    getModuleResolvers(CLIENT),
  ],
};

const serverOpts = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: true },
        modules: 'auto',
      },
    ],
  ],
  plugins: [getModuleResolvers(SERVER)],
};

const serverProd = merge(commonOpts, prodOpts, serverOpts);
const serverDev = merge(commonOpts, devOpts, serverOpts);
const server = {
  [PROD]: serverProd,
  [DEV]: serverDev,
  [TEST]: serverDev,
};
const clientProd = merge(commonOpts, prodOpts, clientOpts);
const clientDev = merge(commonOpts, devOpts, devClientOpts, clientOpts);
const client = {
  [PROD]: clientProd,
  [DEV]: clientDev,
  [TEST]: clientDev,
};

module.exports = {
  [SERVER]: server,
  [COMMON]: server,
  [CLIENT]: client,
};
