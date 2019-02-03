/* eslint-disable import/no-extraneous-dependencies */
const nodeExternals = require('webpack-node-externals');
const path = require('path');

const root = process.env.PWD;
const srcRoot = path.join(root, 'src/server');

module.exports = () => ({
  entry: { server: srcRoot },
  target: 'node',
  resolve: {
    alias: {
      '@app': path.join(srcRoot, 'app'),
      '@domain': path.join(srcRoot, 'domain'),
      '@infra': path.join(srcRoot, 'infra'),
      '@interfaces': path.join(srcRoot, 'interfaces'),
    },
    extensions: ['.js'],
  },
  externals: [nodeExternals()],
});
