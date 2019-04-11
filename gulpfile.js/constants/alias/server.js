const {
  targets: { SERVER }
} = require('../types');

const commonAlias = require('./common');
const { getSrcPath } = require('../../lib/path-utils');

module.exports = {
  ...commonAlias,
  '@config': getSrcPath(SERVER, 'config.json'),
  '@container': getSrcPath(SERVER, 'container'),
  '@app': getSrcPath(SERVER, 'app'),
  '@domain': getSrcPath(SERVER, 'domain'),
  '@infra': getSrcPath(SERVER, 'infra'),
  '@interfaces': getSrcPath(SERVER, 'interfaces')
};
