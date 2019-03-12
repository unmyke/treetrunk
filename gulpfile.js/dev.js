/* eslint-disable import/no-extraneous-dependencies */
const { parallel, series } = require('gulp');
const { DEV } = require('./_lib/envs');
const getTaskName = require('./_lib/get-task-name');
const {
  [getTaskName({
    name: 'transpile',
    target: 'server',
    env: DEV,
  })]: transpileServer,
  [getTaskName({
    name: 'transpile',
    target: 'config',
    env: DEV,
  })]: transpileConfig,
} = require('./transpile');
const {
  [getTaskName({ name: 'pack', target: 'client', env: DEV })]: packClient,
} = require('./pack-client');
const {
  [getTaskName({
    name: 'nodemon',
    target: 'server',
    env: DEV,
  })]: nodemonServer,
  [getTaskName({
    name: 'nodemon',
    target: 'config',
    env: DEV,
  })]: nodemonConfig,
} = require('./nodemon');

const devServer = series(
  parallel(transpileConfig, transpileServer),
  nodemonServer
);
const devClient = series(packClient);
const dev = parallel(devServer, devClient);

module.exports = {
  [getTaskName({ name: 'dev', target: 'server' })]: devServer,
  [getTaskName({ name: 'dev', target: 'client' })]: devClient,
  [getTaskName({ name: 'dev' })]: dev,
};
