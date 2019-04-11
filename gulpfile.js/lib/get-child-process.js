const { fork } = require('child_process');

module.exports = (script, ...args = []) =>
  fork(script, {
    execArgv: ['-r', 'source-map-support/register', ...args]
  });
