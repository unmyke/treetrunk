const {
  targets: { SERVER },
} = require('../types');

const commonAliases = require('./common');
const { getSrcPath } = require('../../lib/path-utils');

module.exports = {
  ...commonAliases,
  '@config': getSrcPath(SERVER, 'scopes.json'),
  '@container': getSrcPath(SERVER, 'container'),
  '@app': getSrcPath(SERVER, 'app'),
  '@domain': getSrcPath(SERVER, 'domain'),
  '@infra': getSrcPath(SERVER, 'infra'),
  '@interfaces': getSrcPath(SERVER, 'interfaces'),
};
