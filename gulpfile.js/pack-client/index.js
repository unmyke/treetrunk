const { PROD, DEV } = require('../_lib/envs');
const getTaskName = require('../_lib/get-task-name');

module.exports = {
  [getTaskName({ name: 'pack', target: 'client', env: PROD })]: () =>
    Promise.resolve(),
  [getTaskName({ name: 'pack', target: 'client', env: DEV })]: () =>
    Promise.resolve(),
};
