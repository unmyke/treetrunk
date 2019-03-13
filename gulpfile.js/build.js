/* eslint-disable import/no-extraneous-dependencies */
const { parallel, series } = require('gulp');

const { PROD } = require('./_lib/envs');
const getTaskName = require('./_lib/get-task-name');

const {
  [getTaskName({ name: 'clean', target: 'common' })]: cleanCommon,
  [getTaskName({ name: 'clean', target: 'server' })]: cleanServer,
  // [getTaskName({ name: 'clean', target: 'client' })]: cleanClient,
} = require('./clean');
const {
  [getTaskName({
    name: 'transpile',
    target: 'common',
    env: 'production',
  })]: transpileCommon,
  [getTaskName({
    name: 'transpile',
    target: 'server',
    env: 'production',
  })]: transpileServer,
} = require('./transpile');
const {
  [getTaskName({ name: 'pack', target: 'client', env: PROD })]: packClient,
} = require('./pack-client');

const buildCommon = series(cleanCommon, transpileCommon);
const buildServer = series(
  parallel(cleanCommon, cleanServer),
  parallel(transpileCommon, transpileServer)
);
const buildClient = packClient;
const build = parallel(buildServer, buildClient);

module.exports = {
  [getTaskName({ name: 'build', target: 'common' })]: buildCommon,
  [getTaskName({ name: 'build', target: 'server' })]: buildServer,
  [getTaskName({ name: 'build', target: 'client' })]: buildClient,
  [getTaskName({ name: 'build' })]: build,
};
