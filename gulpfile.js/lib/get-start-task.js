const {
  types: {
    envs: { PROD },
    targets: { SERVER }
  }
} = require('../constants');

const getOutputPath = require('./get-output-path');
const getBundleTask = require('./get-bundle-task');
const getRunBuildTask = require('./get-run-build-task');

module.exports = target =>
  getBundleTask({ target: SERVER, env: PROD }).then(stats =>
    getRunBuildTask(getOutputPath({ stats, entry: target }))
  );
