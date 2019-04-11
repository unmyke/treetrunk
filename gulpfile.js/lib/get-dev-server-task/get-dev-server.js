const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const getOptions = require('./get-options');

const {
  types: {
    envs: { DEV },
    targets: { CLIENT },
  },
} = require('../../constants');
const getTargetConfig = require('../get-target-config');

module.exports = (options) =>
  getTargetConfig({ target: CLIENT, env: DEV }).then((config) => {
    const { webpackOptions, devServerOptions } = getOptions({
      options,
      config,
    });
    WebpackDevServer.addDevServerEntrypoints(webpackOptions, devServerOptions);

    const compiler = webpack(webpackOptions);
    const server = new WebpackDevServer(compiler, devServerOptions);
    return {
      server,
      host: config.web.host,
      port: config.web.port,
    };
  });
