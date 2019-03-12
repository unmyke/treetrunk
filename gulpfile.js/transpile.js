/* eslint-disable import/no-extraneous-dependencies */
const { src, dest } = require('gulp');
const babel = require('gulp-babel');

const envs = require('./_lib/envs');
const targets = require('./_lib/target-globs');
const getBabelConfig = require('./_lib/get-babel-config');

const getTaskName = require('./_lib/get-task-name');

const getTranspileTask = ({ env, target }) =>
  src(targets[target].src)
    .pipe(babel(getBabelConfig({ env, target })))
    .pipe(dest(targets[target].dest));

module.exports = Object.keys(targets).reduce(
  (transpileTargetTasks, target) => ({
    ...transpileTargetTasks,
    ...Object.values(envs).reduce(
      (transpileEnvTasks, env) => ({
        ...transpileEnvTasks,
        [getTaskName({ name: 'transpile', target, env })]: () =>
          getTranspileTask({ env, target }),
      }),
      {}
    ),
  }),
  {}
);
