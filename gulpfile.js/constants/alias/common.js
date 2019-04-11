const {
  targets: { COMMON }
} = require('../types');
const { getSrcPath } = require('../../lib/path-utils');

module.exports = {
  '@common': getSrcPath(COMMON)
};
