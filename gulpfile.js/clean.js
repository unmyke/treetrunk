/* eslint-disable import/no-extraneous-dependencies */
const del = require('del');
const targets = require('./_lib/target-globs');
const getTaskName = require('./_lib/get-task-name');

module.exports = Object.keys(targets).reduce(
  (cleanTasks, target) => ({
    ...cleanTasks,
    [getTaskName({ name: 'clean', target })]: () => del(targets[target].dest),
  }),
  {}
);
