/* eslint-disable indent */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const root = process.env.PWD;
const rootSrc = path.resolve(root, 'src/client/');

module.exports = () => ({
  entry: { client: rootSrc },
  target: 'web',
  output: {
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      VERSION: JSON.stringify('5fa3b9'),
      'process.BROWSER_SUPPORTS_HTML5': true,
      TWO: '1+1',
      'typeof window': JSON.stringify('object'),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new HtmlWebpackPlugin({
      template: path.join(rootSrc, 'public/index.html'),
      favicon: path.join(rootSrc, 'public/favicon.ico'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: ['url-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      // '@config': path.join(root, 'config'),
      '@features': path.join(rootSrc, 'features'),
      '@ui': path.join(rootSrc, 'ui'),
      '@lib': path.join(rootSrc, 'lib'),
    },
    extensions: ['.mjs', '.js', '.jsx'],
  },
  node: {
    process: true,
  },
  externals: ['./webpack'],
});
