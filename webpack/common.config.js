const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const outputDirectory = path.resolve(__dirname, '../dist');
const rootDirectory = path.resolve(__dirname, '..');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  output: {
    path: outputDirectory,
    filename: '[name].bundle.js',
  },
  plugins: [new CleanWebpackPlugin([outputDirectory], { root: rootDirectory })],
  resolve: {
    alias: {
      '@config': path.resolve(__dirname, '../config'),
    },
  },
  stats: {
    colors: true,
  },
};
