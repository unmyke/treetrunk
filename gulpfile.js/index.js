const { cleanServer, cleanCommon, cleanClient, clean } = require('./clean');
const {
  transpileServer,
  transpileClient,
  transpile,
  transpileDevServer,
  transpileDevClient,
  transpileDev,
} = require('./transpile');
const {
  bundleServer,
  bundleClient,
  bundle,
  bundleDevServer,
  bundleDevClient,
  bundleDev,
} = require('./bundle');
const { devServer, devConsole, devClient, dev } = require('./dev');
const start = require('./start');

module.exports = {
  cleanServer,
  cleanCommon,
  cleanClient,
  clean,
  transpileServer,
  transpileClient,
  transpile,
  transpileDevServer,
  transpileDevClient,
  transpileDev,
  bundleServer,
  bundleClient,
  bundle,
  bundleDevServer,
  bundleDevClient,
  bundleDev,
  devServer,
  devConsole,
  devClient,
  dev,
  start,
};
