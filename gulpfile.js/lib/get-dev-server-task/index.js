const {
  types: {
    envs: { DEV }
  },
  webpackOptions
} = require('../../constants');

const handleSIGINT = require('../handle-sigint');
const getDevServer = require('./get-dev-server');

module.exports = traget =>
  getDevServer(webpackOptions[traget](DEV))
    .then(({ server, host, port }) =>
      server.listen(port, host, err => {
        if (err) throw err;
        else {
          console.log(`Client started at http://${host}:${port}`);
        }
      })
    )
    .then(
      server =>
        new Promise(resolve => {
          server.on('close', () => {
            resolve();
          });
          handleSIGINT(() => {
            server.close(() => {
              console.log('Client stopped. 👋');
            });
          });
        })
    );
