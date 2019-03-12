/* eslint-disable import/no-extraneous-dependencies */
const { series } = require('gulp');
const { exec } = require('child_process');
const getTaskName = require('./_lib/get-task-name');
const {
  server: { dest },
} = require('./_lib/target-globs');

const {
  [getTaskName({ name: 'build', target: 'server' })]: buildServer,
  [getTaskName({ name: 'build' })]: build,
} = require('./build');

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
    start
  ),
  [getTaskName({ name: 'start' })]: series(build, start),
};
