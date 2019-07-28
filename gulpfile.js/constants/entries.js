const {
  targets: { SERVER, CLIENT, COMMON, CONSOLE },
} = require('./types');

const indexFileName = 'index.js';

module.exports = {
  [SERVER]: indexFileName,
  [CONSOLE]: 'interfaces/console',
  [COMMON]: indexFileName,
  [CLIENT]: indexFileName,
};
