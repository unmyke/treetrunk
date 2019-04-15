const {
  targets: { CLIENT },
} = require('../types');
const { getSrcPath } = require('../../lib/path-utils');
const commonAliases = require('./common');

module.exports = {
  ...commonAliases,
  '@config': getSrcPath(CLIENT, 'scopes.json'),
  '@ui': getSrcPath(CLIENT, 'ui'),
  '@features': getSrcPath(CLIENT, 'features'),
  '@constants': getSrcPath(CLIENT, 'constants'),
  '@lib': getSrcPath(CLIENT, 'lib'),
};
