/* eslint-disable import/no-extraneous-dependencies */
const { parallel, series } = require('gulp');

const { PROD } = require('./_lib/envs');
const getTaskName = require('./_lib/get-task-name');

const {
  [getTaskName({ name: 'clean', target: 'server' })]: cleanServer,
  [getTaskName({ name: 'clean', target: 'config' })]: cleanConfig,
} = require('./clean');
const {
  [getTaskName({
    name: 'transpile',
    target: 'server',
    env: 'production',
  })]: transpileServer,
  [getTaskName({
    name: 'transpile',
    target: 'config',
    env: 'production',
  })]: transpileConfig,
} = require('./transpile');
const {
  [getTaskName({ name: 'pack', target: 'client', env: PROD })]: packClient,
} = require('./pack-client');

const buildServer = series(
  parallel(cleanConfig, cleanServer),
  parallel(transpileConfig, transpileServer)
);
const buildClient = packClient;
const build = parallel(buildServer, buildClient);

module.exports = {
  [getTaskName({ name: 'build', target: 'server' })]: buildServer,
  [getTaskName({ name: 'build', target: 'client' })]: buildClient,
  [getTaskName({ name: 'build' })]: build,
};
