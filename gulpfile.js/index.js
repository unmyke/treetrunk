const buildTarget = require('./build-target');
// const watch = require('./watch');

module.exports = {
  'build:server': buildTarget('server'),
  'build:client': buildTarget('client'),
  build: buildTarget(),
};
