/* eslint-disable import/no-extraneous-dependencies */
const { parallel, series } = require('gulp');

const { PROD } = require('./envs');

const { server: cleanServer } = require('./clean');
const { [PROD]: transpileServer } = require('./transpile-server');
const { [PROD]: packClient } = require('./pack-client');

const server = series(cleanServer, transpileServer);
const client = packClient;
const all = parallel(server, client);

module.exports = {
  server,
  client,
  all,
};
