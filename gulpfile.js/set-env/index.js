const envs = require('../_lib/envs');
const getTaskName = require('../_lib/get-task-name');
const getEnvVars = require('./get-env-vars');

module.exports = Object.values(envs).reduce(
  (setEnvTasks, env) => ({
    ...setEnvTasks,
    [getTaskName({ name: 'set-env', env })]: getEnvVars(env),
  }),
  {}
);
