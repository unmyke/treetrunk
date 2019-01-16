/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: { cleint: './src/client' },
  target: 'web',
  output: { publicPath: '/' },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/public/index.html',
      favicon: './src/client/public/favicon.ico',
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
      '@features': path.resolve(__dirname, '../src/client/features'),
      '@ui': path.resolve(__dirname, '../src/client/ui'),
      '@constants': path.resolve(__dirname, '../src/client/constants'),
      '@lib': path.resolve(__dirname, '../src/client/lib'),
    },
    extensions: ['.mjs', '.js', '.jsx'],
  },
  devServer: {
    open: true,
    compress: true,
    contentBase: path.resolve(__dirname, '../dist/'),
    watchContentBase: true,
    historyApiFallback: true,
    proxy: {
      '/graphql': 'http://localhost:9000',
    },
  },
};
