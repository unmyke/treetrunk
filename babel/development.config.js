const getConfig = require('./getConfig');

const config = {
  presets: [
    [
      '@babel/preset-env',
      {
        debug: true,
      },
    ],
  ],
};

module.exports = getConfig(config);
