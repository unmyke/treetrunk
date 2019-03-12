const {
  server: buildServer,
  client: buildClient,
  all: build,
} = require('./build');
const { server: devServer, client: devClient, all: dev } = require('./dev');
// const watch = require('./watch');

module.exports = {
  'build:server': buildServer,
  'build:client': buildClient,
  build,
  'dev:server': devServer,
  'dev:client': devClient,
  dev,
};
