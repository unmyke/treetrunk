const nodeExternals = require('webpack-node-externals');
const babelOptions = require('../babel/server.config');
const path = require('path');

module.exports = {
  name: 'server',
  entry: './src/server',
  target: 'node',
  resolve: {
    alias: {
      '@app': path.resolve('../src/server/app'),
      '@domain': path.resolve('../src/server/domain'),
      '@infra': path.resolve('../src/server/infra'),
      '@interfaces': path.resolve('../src/server/interfaces'),
    },
  },
  externals: [nodeExternals()],
};
