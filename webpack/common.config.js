/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const outputDirectory = path.resolve(__dirname, '../dist');
const rootDirectory = path.resolve(__dirname, '..');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  plugins: [new CleanWebpackPlugin([outputDirectory], { root: rootDirectory })],
  loaders: [
    {
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    },
  ],
  resolve: {
    alias: {
      '@config': path.resolve(__dirname, '../config'),
    },
  },
  stats: {
    colors: true,
  },
};
