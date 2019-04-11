const { HotModuleReplacementPlugin } = require('webpack');

const {
  types: {
    targets: { CLIENT },
  },
} = require('../../constants');
const { getDstPath } = require('../path-utils');

const defaultOptions = {
  contentBase: getDstPath(CLIENT),
  // publicPath: "",
  hot: true,
  historyApiFallback: true,
  stats: {
    colors: true,
  },
  noInfo: true,
  disableHostCheck: true,
  open: true,
  compress: true,
};

module.exports = ({
  options,
  config: {
    api: { port: apiPort, uri: apiUri },
    web: { host, port },
  },
}) => {
  const { plugins: pluginsOption } = options;

  const plugins = [...pluginsOption, new HotModuleReplacementPlugin()];
  const webpackOptions = {
    ...options,
    plugins,
  };

  const devServerOptions = {
    ...defaultOptions,
    host,
    port,
    proxy: {
      [apiUri]: {
        target: {
          host: '0.0.0.0',
          protocol: 'http:',
          port: apiPort,
        },
        // pathRewrite: {
        //   "^/api": ""
        // }
      },
    },
  };
  return { webpackOptions, devServerOptions };
};
