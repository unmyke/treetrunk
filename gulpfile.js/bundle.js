const { parallel } = require('gulp');

const {
  types: {
    envs: { PROD, DEV },
    targets: { SERVER, CLIENT },
  },
} = require('./constants');
const getBundleTask = require('./lib/get-bundle-task');

const bundleServer = () => getBundleTask({ target: SERVER, env: PROD });
const bundleClient = () => getBundleTask({ target: CLIENT, env: PROD });
const bundle = parallel(bundleServer, bundleClient);

const bundleDevServer = () => getBundleTask({ target: SERVER, env: DEV });
const bundleDevClient = () => getBundleTask({ target: CLIENT, env: DEV });
const bundleDev = parallel(bundleDevServer, bundleDevClient);

module.exports = {
  bundleServer,
  bundleClient,
  bundle,
  bundleDevServer,
  bundleDevClient,
  bundleDev,
};
