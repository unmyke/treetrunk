/* eslint-disable import/no-extraneous-dependencies */
const { parallel, series } = require('gulp');

const { server: cleanServer } = require('../clean');
const { production: transpileServer } = require('./transpile-server');
const { production: packClient } = require('./pack-client');

const server = series(cleanServer, transpileServer);
const client = packClient;
const all = parallel(server, client);

module.exports = {
  server,
  client,
  all,
};
