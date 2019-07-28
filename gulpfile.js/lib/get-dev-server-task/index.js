const {
  types: {
    envs: { DEV },
  },
  webpackOptions,
} = require('../../constants');

const handleSIGINT = require('../handle-sigint');
const getDevServer = require('./get-dev-server');

module.exports = (traget) =>
  getDevServer(webpackOptions[traget](DEV)).then(
    ({ server, host, port }) =>
      new Promise((resolve) => {
        server.listen(port, host, (err) => {
          if (err) throw err;
          else {
            console.log(`Client started at http://${host}:${port}`);
          }
        });

        handleSIGINT(() => {
          server.close(() => {
            console.log('Client stopped. 👋');
            resolve();
          });
        });
      })
  );
