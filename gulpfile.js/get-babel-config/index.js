const client = require('./client');
const server = require('./server');

const configs = { client, server };

module.exports = ({ env = 'development', target = 'server' }) =>
  configs[target](env);
