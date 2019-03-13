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
    target: 'common',
    env: DEV,
  })]: transpileCommon,
} = require('./transpile');
const {
  [getTaskName({ name: 'pack', target: 'client', env: DEV })]: packClient,
} = require('./pack-client');
const {
  [getTaskName({
    name: 'nodemon',
    target: 'server',
  })]: nodemonServer,
  // [getTaskName({
  //   name: 'nodemon',
  //   target: 'common',
  // })]: nodemonCommon,
} = require('./nodemon');

const devServer = series(
  parallel(transpileCommon, transpileServer),
  nodemonServer
);
const devClient = series(packClient);
const dev = parallel(devServer, devClient);

module.exports = {
  [getTaskName({ name: 'dev', target: 'server' })]: devServer,
  [getTaskName({ name: 'dev', target: 'client' })]: devClient,
  [getTaskName({ name: 'dev' })]: dev,
};
