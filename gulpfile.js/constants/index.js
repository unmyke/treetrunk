const { resolve } = require('path');

const types = require('./types');
const alias = require('./alias');
const dirs = require('./dirs');
const entries = require('./entries');
const globs = require('./globs');
const babelOptions = require('./babel-options');
const webpackOptions = require('./webpack-options');
const targetConfigs = require('./target-configs');
const configDir = resolve(process.cwd(), './config');
const webpackStatsOptions = require('./webpack-stats-options');

module.exports = {
  types,
  alias,
  dirs,
  entries,
  globs,
  babelOptions,
  webpackOptions,
  targetConfigs,
  configDir,
  webpackStatsOptions,
};
