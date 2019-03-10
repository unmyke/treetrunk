/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');

const root = process.env.PWD;

module.exports = (target) => {
  const config = {
    mode: 'development',
    plugins: [
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ],
    devtool: 'eval-source-map',
    // optimization: {
    //   runtimeChunk: true,
    // },
  };

  if (target === 'client') {
    config.devServer = {
      open: true,
      compress: true,
      contentBase: path.join(root, 'dist/client'),
      watchContentBase: true,
      historyApiFallback: true,
      proxy: [
        {
          context: ['/graphql', '/auth'],
          target: `http://localhost:${process.env.API_PORT}`,
          secure: false,
        },
      ],
    };
  }

  return config;
};
