const configs = require('./configs');

module.exports = ({ env = 'development', target = 'server' }) =>
  configs[target](env);
