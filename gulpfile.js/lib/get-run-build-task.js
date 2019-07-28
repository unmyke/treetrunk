const getChildProcess = require('./get-child-process');

const handleSIGINT = require('./handle-sigint');

module.exports = (script) =>
  new Promise((resolve, reject) => {
    const child = getChildProcess(script).on('error', (err) => {
      reject(err);
    });

    handleSIGINT(() => {
      child.emit('exit');
      resolve();
    });
  });
