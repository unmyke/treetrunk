const {
  types: {
    targets: { SERVER },
  },
  babelOptions: { [SERVER]: babelOptions },
} = require('./gulpfile.js/constants');

module.exports = babelOptions.test;
