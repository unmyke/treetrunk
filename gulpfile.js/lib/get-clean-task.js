const del = require('del');
const { getDstPath } = require('./path-utils');

module.exports = target => del(getDstPath(target));
