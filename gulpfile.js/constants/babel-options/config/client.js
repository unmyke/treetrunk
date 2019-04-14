const getJsonConfig = require('get-json-config');

module.exports = getJsonConfig.sync(['api', 'web']).config;
