const path = require('path');

module.exports = {
  env: {
    browser: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: path.resolve(__dirname, '../../webpack.config.js'),
        'config-index': 2,
      },
    },
  },
};
