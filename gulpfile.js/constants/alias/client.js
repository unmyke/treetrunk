const {
  targets: { CLIENT }
} = require('../types');
const { getSrcPath } = require('../../lib/path-utils');
const commonAlias = require('./common');

module.exports = {
  ...commonAlias,
  '@config': getSrcPath(CLIENT, 'config.json'),
  '@ui': getSrcPath(CLIENT, 'ui'),
  '@features': getSrcPath(CLIENT, 'features'),
  '@constants': getSrcPath(CLIENT, 'constants'),
  '@lib': getSrcPath(CLIENT, 'lib')
};
