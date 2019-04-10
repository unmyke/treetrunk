const nodemon = require('nodemon');

const once = require('../once');

module.exports = once((script) =>
  nodemon({
    script,
    ignore: ['*'],
    ext: 'noop',
    stdout: true,
    stdin: false,
    restartable: false,
    verbose: true,
  })
);
