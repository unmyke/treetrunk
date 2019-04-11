const {
  types: {
    targets: { SERVER },
    envs: { DEV },
    webpackStatsOptions: { WARN, ERROR }
  }
} = require('../../constants');
const getOutputPath = require('../get-output-path');
const getCompiler = require('../get-compiler');
const consoleStats = require('../console-stats');
const handleSIGINT = require('../handle-sigint');
const getChildProcess = require('../get-child-process');

// const getNodemon = require('./get-nodemon');

const shutdownSubprocess = subprocess => {
  if (subprocess && subprocess.kill) subprocess.kill('SIGUSR2');
  else console.log('process is not exited', subprocess);
};

const watchOptions = {
  // aggregateTimeout: 600,
  // poll: 1000,
  // ignored: []
};

module.exports = entry =>
  new Promise(resolve => {
    let subprocess;

    const compiler = getCompiler({ target: SERVER, env: DEV });
    const watcher = compiler.watch(watchOptions, (err, stats) => {
      switch (true) {
        case err || stats.hasErrors():
          consoleStats(stats, ERROR);
          break;
        case stats.hasWarnings():
          consoleStats(stats, WARN);

        default:
          if (subprocess) shutdownSubprocess(subprocess);
          subprocess = getChildProcess(
            getOutputPath({ stats, entry: entry })
          ).on('message', message => {
            if (message === 'SIGINT') {
              process.emit(message);
              subprocess = undefined;
            }
          });

          break;
      }
    });
    handleSIGINT(() => {
      watcher.close();
      shutdownSubprocess(subprocess);
      console.log(
        `${entry.slice(0, 1).toUpperCase()}${entry.slice(1)} stopped. 👋`
      );
      resolve();
    });
  });
