const { parallel } = require('gulp');

const {
  types: {
    targets: { SERVER, CLIENT, CONSOLE }
  }
} = require('./constants');

const getWatchTask = require('./lib/get-watch-task');
const getDevServerTask = require('./lib/get-dev-server-task');

const devServer = done => getWatchTask(SERVER, done);
const devConsole = done => getWatchTask(CONSOLE, done);
const devClient = done => getDevServerTask(CLIENT, done);
const dev = parallel(devServer, devClient);

module.exports = {
  devServer,
  devConsole,
  devClient,
  dev
};
