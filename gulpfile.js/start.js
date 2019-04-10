const {
  types: {
    targets: { SERVER },
  },
} = require('./constants');
const getStartTask = require('./lib/get-start-task');

const start = (done) => getStartTask(SERVER, done);

module.exports = start;
