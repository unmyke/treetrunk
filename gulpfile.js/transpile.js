const { series, parallel } = require('gulp');

const { cleanServer, cleanCommon } = require('./clean');
const {
  types: {
    envs: { DEV, PROD },
    targets: { SERVER, COMMON }
  }
} = require('./constants');
const getTranspileTask = require('./lib/get-transpile-task');

const transpileOnlyProdServer = () =>
  getTranspileTask({ target: SERVER, env: PROD });
const transpileOnlyProdCommon = () =>
  getTranspileTask({ target: COMMON, env: PROD });

const transpileOnlyDevServer = () =>
  getTranspileTask({ target: SERVER, env: DEV });
const transpileOnlyDevCommon = () =>
  getTranspileTask({ target: COMMON, env: DEV });

const transpileServer = series(cleanServer, transpileOnlyProdServer);
const transpileCommon = series(cleanCommon, transpileOnlyProdCommon);
const transpile = parallel(transpileServer, transpileCommon);

const transpileDevServer = series(cleanServer, transpileOnlyDevServer);
const transpileDevCommon = series(cleanCommon, transpileOnlyDevCommon);
const transpileDev = parallel(transpileDevServer, transpileDevCommon);

module.exports = {
  transpileServer,
  transpileCommon,
  transpile,
  transpileDevServer,
  transpileDevCommon,
  transpileDev
};
