/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import merge from 'deepmerge';

import configTypes from './config-types';

export default ({ target, mode }) =>
  configTypes[target].reduce(
    (configAcc, configName) => ({
      ...configAcc,
      [configName]: merge(
        require(`./${configName}/common`),
        require(`./${configName}/${mode}`)
      ),
    }),
    {
      [mode]: true,
      env: mode,
    }
  );
