import getConfig from './get-config';

const { NODE_ENV: mode, TARGET: target } = process.env;

const configTypes = {
  console: ['api', 'web', 'db', 'app', 'logging'],
  server: ['api', 'web', 'db', 'app', 'logging'],
  client: ['web', 'api'],
};
const initConfig = {
  [mode]: true,
  env: mode,
};

export default configTypes[target].reduce(
  (configAcc, configName) => ({
    ...configAcc,
    [configName]: getConfig({ configName, mode }),
  }),
  initConfig
);
