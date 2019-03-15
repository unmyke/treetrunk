/* eslint-disable import/no-extraneous-dependencies */
const { series } = require('gulp');
const { exec } = require('child_process');
const getTaskName = require('./_lib/get-task-name');
const {
  server: { dest },
} = require('./_lib/target-globs');
const { PROD } = require('./_lib/envs');

const {
  [getTaskName({ name: 'build', target: 'server' })]: buildServer,
  [getTaskName({ name: 'build' })]: build,
} = require('./build');

const {
  [getTaskName({ name: 'set-env', env: PROD })]: setProdEnv,
} = require('./set-env');

const start = (cb) => {
  exec(`node ${dest}`, (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
};

module.exports = {
  [getTaskName({ name: 'start', target: 'server' })]: series(
    buildServer,
    setProdEnv,
    start
  ),
  [getTaskName({ name: 'start' })]: series(build, setProdEnv, start),
};
