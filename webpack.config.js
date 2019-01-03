const merge = require('webpack-merge');

const webpackConfigs = {
  common: require('./webpack/common.config'),
  server: require('./webpack/server.config'),
  client: require('./webpack/client.config'),
  production: require('./webpack/production.config'),
  development: require('./webpack/development.config'),
};

const babelConfig = {
  common: require('./babel/common.config'),
  server: require('./babel/server.config'),
  client: require('./babel/client.config'),
  production: require('./babel/production.config'),
  development: require('./babel/development.config'),
};

const getBabelModule = (configName) => ({
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: babelConfig[configName],
        },
      },
    ],
  },
});

const serverProductionConfig = merge(
  common,
  production,
  server,
  getBabelModule('common'),
  getBabelModule('server'),
  getBabelModule('production')
);
const serverDevelopmentConfig = merge(
  webpackConfigs['common'],
  webpackConfigs['development'],
  webpackConfigs['server'],
  getBabelModule('common'),
  getBabelModule('server'),
  getBabelModule('development')
);
const clientProductionConfig = merge(
  webpackConfigs['common'],
  webpackConfigs['production'],
  webpackConfigs['client'],
  getBabelModule('common'),
  getBabelModule('client'),
  getBabelModule('production')
);
const clientDevelopmentConfig = merge(
  webpackConfigs['common'],
  webpackConfigs['development'],
  webpackConfigs['client'],
  getBabelModule('common'),
  getBabelModule('client'),
  getBabelModule('development')
);

module.exports = [
  serverProductionConfig,
  serverDevelopmentConfig,
  clientProductionConfig,
  clientDevelopmentConfig,
];
