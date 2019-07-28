const { sync: getJsonConfigSync } = require('get-json-config');

const { config } = getJsonConfigSync({ env: 'test' });

module.exports = config;
