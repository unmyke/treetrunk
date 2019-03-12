const { parallel, series } = require('gulp');
const { DEV } = require('./envs');
const { [DEV]: transpileServer } = require('./transpile-server');
const { [DEV]: packClient } = require('./pack-client');

const server = series(transpileServer);
const client = series(packClient);
const all = parallel(server, client);

module.exports = {
  server,
  client,
  all,
};
