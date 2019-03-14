require('module-alias/register');

const getTaskName = require('./_lib/get-task-name');

const {
  [getTaskName({ name: 'build', target: 'common' })]: buildCommon,
  [getTaskName({ name: 'build', target: 'server' })]: buildServer,
  [getTaskName({ name: 'build', target: 'client' })]: buildClient,
  [getTaskName({ name: 'build' })]: build,
} = require('./build');
const {
  [getTaskName({ name: 'dev', target: 'server' })]: devServer,
  [getTaskName({ name: 'dev', target: 'client' })]: devClient,
  [getTaskName({ name: 'dev' })]: dev,
} = require('./dev');

const {
  [getTaskName({ name: 'start', target: 'server' })]: startServer,
  [getTaskName({ name: 'start' })]: start,
} = require('./start');
// const watch = require('./watch');

module.exports = {
  'build:common': buildCommon,
  'build:server': buildServer,
  'build:client': buildClient,
  build,
  'dev:server': devServer,
  'dev:client': devClient,
  dev,
  'start:server': startServer,
  start,
};
