const { targetConfigs } = require('../constants');
const getConfig = require('get-json-config');

module.exports = ({ target, env }) =>
  getConfig(targetConfigs[target], { env }).then(({ config }) => config);
