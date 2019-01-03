const path = require('path');
const outputDirectory = path.resolve(__dirname, '..', '../dist');

module.exports = {
  mode: 'development',
  output: {
    path: outputDirectory,
    filename: '[name].bundle.js',
  },
  devtool: 'source-map',
};
