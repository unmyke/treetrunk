const {
  types: {
    targets: { SERVER },
    envs: { DEV },
    webpackStatsOptions: { WARN, ERROR },
  },
} = require('../../constants');
const getOutputPath = require('../get-output-path');
const getCompiler = require('../get-compiler');
const consoleStats = require('../console-stats');
const once = require('../once');
const handleSIGINT = require('../handle-sigint');

const getNodemon = require('./get-nodemon');

const watchOptions = {
  // aggregateTimeout: 600,
  // poll: 1000,
  // ignored: []
};

let nodemon;

module.exports = (entry) =>
  new Promise((resolve) => {
    const compiler = getCompiler({ target: SERVER, env: DEV });
    const watcher = compiler.watch(watchOptions, (err, stats) => {
      switch (true) {
        case err || stats.hasErrors():
          consoleStats(stats, ERROR);
          break;
        case stats.hasWarnings():
          consoleStats(stats, WARN);

        default:
          nodemon = getNodemon(getOutputPath({ stats, entry }));

          nodemon.restart();
          break;
      }
    });
    handleSIGINT(() => {
      watcher.close();
      nodemon.emit('quit');
      console.log(
        `${entry.slice(0, 1).toUpperCase()}${entry.slice(1)} stopped. 👋`
      );
      resolve();
    });
  });
