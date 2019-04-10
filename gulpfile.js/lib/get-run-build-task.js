const { fork } = require('child_process');

const handleSIGINT = require('./handle-sigint');

module.exports = (script) =>
  new Promise((resolve, reject) => {
    const child = fork(script, {
      execArgv: ['-r', 'source-map-support/register'],
    }).on('error', (err) => {
      reject(err);
    });

    handleSIGINT(() => {
      child.emit('exit');
      resolve();
    });
  });
