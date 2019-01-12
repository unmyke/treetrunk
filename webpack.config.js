/* eslint-disable global-require */
const merge = require('webpack-merge');

const upperFirst = (str) => str[0].toUpperCase() + str.slice(1);

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

const serverProductionConfig = merge.smart(
  webpackConfigs.common,
  webpackConfigs.production,
  webpackConfigs.server,
  babelConfig.common,
  babelConfig.server,
  babelConfig.production,
  {
    name: 'server-production',
  }
);
const serverDevelopmentConfig = merge.smart(
  webpackConfigs.common,
  webpackConfigs.development,
  webpackConfigs.server,
  babelConfig.common,
  babelConfig.server,
  babelConfig.development,
  {
    name: 'server-development',
  }
);
const clientProductionConfig = merge.smart(
  webpackConfigs.common,
  webpackConfigs.production,
  webpackConfigs.client,
  babelConfig.common,
  babelConfig.client,
  babelConfig.production,
  {
    name: 'client-production',
  }
);
const clientDevelopmentConfig = merge.smart(
  webpackConfigs.common,
  webpackConfigs.development,
  webpackConfigs.client,
  babelConfig.common,
  babelConfig.client,
  babelConfig.development,
  {
    name: 'client-development',
  }
);

module.exports = [
  serverProductionConfig,
  serverDevelopmentConfig,
  clientProductionConfig,
  clientDevelopmentConfig,
];
