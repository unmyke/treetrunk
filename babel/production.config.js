const getConfig = require('./getConfig');

const config = {
  presets: [
    [
      '@babel/preset-env',
      {
        forceAllTransforms: true,
      },
    ],
  ],
};

module.exports = getConfig(config);
