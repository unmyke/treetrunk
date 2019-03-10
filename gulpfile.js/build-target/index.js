/* eslint-disable import/no-extraneous-dependencies */
const { parallel, series } = require('gulp');
const cleanServer = require('../clean-server');

const transpileServer = require('./transpile-server')('production');
const packClient = require('./pack-client')('production');

const buildServer = series(cleanServer, transpileServer);
const buildClient = packClient;
const build = parallel(buildServer, buildClient);

module.exports = (target) => {
  switch (target) {
    case 'server':
      return buildServer;

    case 'client':
      return buildClient;

    default:
      return build;
  }
};
