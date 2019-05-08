const getChildInspectBrkOption = require('./get-child-inspect-brk-option');
const { fork } = require('child_process');

module.exports = (script, ...args) =>
  fork(script, {
    execArgv: [
      '--require=source-map-support/register',
      ...getChildInspectBrkOption(),
      ...args,
    ],
  });
