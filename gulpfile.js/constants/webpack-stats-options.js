const {
  webpackStatsOptions: { WARN, ERROR, LOG }
} = require('./types');

const colors = true;

module.exports = {
  [LOG]: { all: true, colors },
  [WARN]: {
    all: false,
    modules: true,
    maxModules: 0,
    errors: true,
    warnings: true,
    colors
  },
  [ERROR]: {
    all: false,
    errors: true,
    moduleTrace: true,
    colors
  }
};
