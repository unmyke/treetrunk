const { parallel } = require('gulp');

const {
  types: {
    targets: { SERVER, CLIENT, CONSOLE },
  },
} = require('./constants');

const getWatchTask = require('./lib/get-watch-task');
const getDevServerTask = require('./lib/get-dev-server-task');

const devServer = () => getWatchTask(SERVER);
const devConsole = () => getWatchTask(CONSOLE);
const devClient = () => getDevServerTask(CLIENT);
const dev = parallel(devServer, devClient);

module.exports = {
  devServer,
  devConsole,
  devClient,
  dev,
};
