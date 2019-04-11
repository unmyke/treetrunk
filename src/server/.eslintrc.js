const path = require('path');

module.exports = {
  env: {
    node: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: path.resolve(
          process.cwd(),
          'gulpfile.js/constants/webpack-options/server'
        ),
      },
    },
  },
};
