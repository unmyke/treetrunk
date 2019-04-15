const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const {
  envs: { DEV, PROD },
  targets: { SERVER, COMMON, CONSOLE },
} = require('../types');
const { [SERVER]: babelOptions } = require('../babel-options');
const {
  [SERVER]: serverEntry,
  [COMMON]: commonEntry,
  [CONSOLE]: consoleEntry,
} = require('../entries');
const { [SERVER]: aliases } = require('../aliases');
const { getSrcPath, getDstPath } = require('../../lib/path-utils');

module.exports = (env) => ({
  mode: env === PROD ? PROD : DEV,
  target: 'node',
  entry: {
    [SERVER]: getSrcPath(SERVER, serverEntry),
    [CONSOLE]: getSrcPath(SERVER, consoleEntry),
    [COMMON]: getSrcPath(COMMON, commonEntry),
  },
  output: {
    path: getDstPath(SERVER, { absolute: true }),
    filename: env === PROD ? '[name].[chunkhash:8].js' : '[name].js',
  },
  node: {
    __dirname: true,
    __filename: true,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /^@config$/,
        use: {
          loader: 'app-json-config-loader',
          options: {
            env,
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions[env],
        },
      },
    ],
  },
  plugins: [new CleanWebpackPlugin()],
  resolve: {
    alias: aliases,
  },
  externals: [nodeExternals()],
});
