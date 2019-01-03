const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const babelOptions = require('../babel/client.config');

module.exports = {
  name: 'client',
  entry: './src/client',
  target: 'web',
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
        loader: 'url-loader?limit=100000',
      },
    ],
  },
  resolve: {
    alias: {
      '@features': path.resolve(__dirname, '../src/client/features'),
      '@ui': path.resolve(__dirname, '../src/client/ui'),
    },
  },
  devServer: {
    host: '0.0.0.0', // Required for docker
    port: 8080,
    open: true,
    compress: true,
    contentBase: path.resolve(__dirname, './views'),
    publicPath: '/assets/',
    watchContentBase: true,
    proxy: {
      '/graphql': 'http://localhost:9000',
    },
  },
};
