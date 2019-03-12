/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import merge from 'deepmerge';

export default ({ configName, mode }) => {
  const modeConfig = require(`./${configName}/${mode}`);
  const commonConfig = require(`./${configName}/common`);

  return merge(modeConfig, commonConfig);
};
