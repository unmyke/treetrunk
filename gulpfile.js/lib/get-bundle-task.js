const {
  types: {
    webpackStatsOptions: { LOG, WARN, ERROR }
  }
} = require('../constants');
const getCompiler = require('./get-compiler');
const consoleStats = require('./console-stats');

module.exports = ({ target, env }) =>
  new Promise((resolve, reject) => {
    const compiler = getCompiler({ target, env });

    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        consoleStats(stats, ERROR);
        return reject(err, stats);
      }

      if (stats.hasWarnings()) {
        consoleStats(stats, WARN);
      } else {
        // consoleStats(stats, LOG);
      }
      resolve(stats);
    });
  });
