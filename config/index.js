/* eslint-disable no-shadow */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const merge = require('webpack-merge');
const configs = require('./configs');

const mode = process.env.NODE_ENV;
const target = process.env.TARGET;

const configTypes = {
  console: ['api', 'web', 'db', 'app', 'logging'],
  server: ['api', 'web', 'db', 'app', 'logging'],
  client: ['web', 'api'],
};
const initConfig = {
  [mode]: true,
  env: mode,
};

const getConfig = ({ configName, mode }) =>
  merge(configs({ configName, mode }), configs({ configName, mode: 'common' }));

const config = configTypes[target].reduce(
  (configAcc, configName) => ({
    ...configAcc,
    [configName]: getConfig({ configName, mode }),
  }),
  initConfig
);

module.exports = config;
