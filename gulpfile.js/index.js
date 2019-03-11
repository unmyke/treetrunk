const { client, server, all } = require('./build');
// const watch = require('./watch');

module.exports = {
  'build:server': server,
  'build:client': client,
  build: all,
};
