const { parallel } = require('gulp');
const {
  types: {
    targets: { SERVER, CLIENT, COMMON }
  }
} = require('./constants');

const getCleanTask = require('./lib/get-clean-task');

const cleanServer = () => getCleanTask(SERVER);
const cleanCommon = () => getCleanTask(COMMON);
const cleanClient = () => getCleanTask(CLIENT);
const clean = parallel(cleanServer, cleanCommon, cleanClient);

module.exports = { cleanServer, cleanClient, cleanCommon, clean };
