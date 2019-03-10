/* eslint-disable import/no-extraneous-dependencies */
const del = require('del');
const getTargetGlobs = require('./get-target-globs');

const cleanTarget = (target) => del(getTargetGlobs(target).dest);
const cleanServer = () => cleanTarget('server');

module.exports = cleanServer;
