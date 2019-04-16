const { resolve } = require('path');
const {
  targets: { SERVER },
} = require(resolve(process.cwd(), 'gulpfile.js/constants/types'));
const { [SERVER]: aliases } = require(resolve(
  process.cwd(),
  'gulpfile.js/constants/aliases'
));

const alias = Object.entries(aliases);

module.exports = {
  env: {
    node: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      alias,
    },
  },
};
