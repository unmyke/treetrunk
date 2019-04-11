const {
  targets: { CLIENT },
} = require('../types');
const { getSrcPath } = require('../../lib/path-utils');
const commonAlias = require('./common');

module.exports = {
  ...commonAlias,
  '@config': getSrcPath(CLIENT, 'scopes.json'),
  '@ui': getSrcPath(CLIENT, 'ui'),
  '@features': getSrcPath(CLIENT, 'features'),
  '@constants': getSrcPath(CLIENT, 'constants'),
  '@lib': getSrcPath(CLIENT, 'lib'),
};
