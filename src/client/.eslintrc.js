const { resolve } = require('path');
const {
  targets: { CLIENT },
} = require(resolve(process.cwd(), 'gulpfile.js/constants/types'));
const { [CLIENT]: aliases } = require(resolve(
  process.cwd(),
  'gulpfile.js/constants/aliases'
));

const alias = Object.entries(aliases);

module.exports = {
  env: {
    browser: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      alias,
    },
  },
};
