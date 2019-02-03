/* eslint-disable no-shadow */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const merge = require('webpack-merge');
const configs = require('./configs');

const mode = process.env.NODE_ENV;
const target = process.env.TARGET;

const configTypes = {
  server: ['api', 'web', 'db', 'app', 'logging'],
  client: ['web', 'api'],
};
const initConfig = {
  [mode]: true,
  env: mode,
};

const getConfig = ({ configName, mode }) =>
  merge(configs({ configName, mode }), configs({ configName, mode: 'common' }));

module.exports = configTypes[target].reduce(
  (configAcc, configName) => ({
    ...configAcc,
    [configName]: getConfig({ configName, mode }),
  }),
  initConfig
);
