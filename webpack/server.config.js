const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  entry: './src/server',
  target: 'node',
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, '../src/server/app'),
      '@domain': path.resolve(__dirname, '../src/server/domain'),
      '@infra': path.resolve(__dirname, '../src/server/infra'),
      '@interfaces': path.resolve(__dirname, '../src/server/interfaces'),
    },
    extensions: ['.js'],
  },
  externals: [nodeExternals()],
};
