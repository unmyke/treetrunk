/* eslint-disable import/no-extraneous-dependencies */
const del = require('del');
const targetGlobs = require('./target-globs');

const getCleanTarget = (target) => del(targetGlobs[target].dest);

const server = () => getCleanTarget('server');
const client = () => getCleanTarget('client');
const all = () => getCleanTarget();

module.exports = {
  server,
  client,
  all,
};
