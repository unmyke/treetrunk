/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
// eslint-disable-next-line import/no-extraneous-dependencies
const merge = require('babel-merge');
const { inspect } = require('util');

module.exports = ({ env = 'development', target = 'server' }) => {
  const commonConfig = require('./common.config');
  const targetConfig = require(`./${target}.config`);
  const envConfig = require(`./${env}.config`);

  console.log(
    inspect(merge(commonConfig, targetConfig, envConfig), {
      depth: null,
      colors: true,
    })
  );

  return merge(commonConfig, targetConfig, envConfig);
};
