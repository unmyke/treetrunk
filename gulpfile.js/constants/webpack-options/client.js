const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const BabelMinifyWebpackPlugin = require('babel-minify-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const {
  envs: { PROD, DEV },
  targets: { CLIENT, COMMON },
} = require('../types');
const { [CLIENT]: aliases } = require('../aliases');
const { [CLIENT]: babelOptions } = require('../babel-options');
const { getSrcPath, getDstPath } = require('../../lib/path-utils');

const srcPath = getSrcPath(CLIENT);
const srcCommonPath = getSrcPath(COMMON);
const dstPath = getDstPath(CLIENT);

module.exports = (env) => ({
  mode: env === PROD ? PROD : DEV,
  target: 'web',
  entry: {
    main: srcPath,
    common: srcCommonPath,
  },
  output: {
    path: dstPath,
    filename: env === PROD ? `js/[name].[chunkhash:8].js"` : `js/[name].js`,
    publicPath: `/`,
  },
  devtool: env === PROD ? false : 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: aliases['@config'],
        use: {
          loader: 'app-json-config-loader',
          options: {
            env,
          },
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions[env],
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|ico)$/,
        use: ['url-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: aliases,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 20,
      maxAsyncRequests: 20,
      name: env !== PROD,
    },
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: getSrcPath(CLIENT, 'public/index.html'),
      templateParameters: {},
      favicon: getSrcPath(CLIENT, 'public/favicon.ico'),
      filename: './index.html',
    }),
    new InterpolateHtmlPlugin({
      PUBLIC_URL: '',
    }),
    new ManifestPlugin(),
    new BabelMinifyWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: '[name]-[contenthash:8].css' }),
  ],
});
