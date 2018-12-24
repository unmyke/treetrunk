const path = require('path');
const server = require('./webpack/server.config.js');
const client = require('./webpack/client.config.js');

function merge(config1, config2) {
  return Object.assign({}, config1, config2);
}

const OUTPUT_DIR = path.resolve(__dirname, 'dist');

const commonConfig = {
  context: path.resolve(__dirname, 'src'),
};

module.exports = function(env, argv) {
  return new Promise((resolve, reject) => {
    return resolve({
      entry: {
        server: './server',
        client: './client',
      },
      output: {
        filename: '[name].bundle.js',
        path: OUTPUT_DIR,
      },
    });
  });
};
