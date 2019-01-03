const path = require('path');
const outputDirectory = path.resolve(__dirname, '..', '../dist');

module.exports = {
  mode: 'production',
  output: {
    path: outputDirectory,
    filename: '[name].[hash].bundle.js',
  },
};
