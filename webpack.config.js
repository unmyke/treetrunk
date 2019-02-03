/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const merge = require('webpack-merge');
const dotenv = require('dotenv');
const getBabelConfig = require('./webpack/getBabelConfig');

module.exports = ({ target = 'server', mode = 'development' }) => {
  dotenv.config({ path: `./.env.${mode}` });

  const webpackCommonConfig = require('./webpack/common.config')(target, mode);
  const webpackTargetConfig = require(`./webpack/${target}.config`)();
  const webpackModeConfig = require(`./webpack/${mode}.config`)(target);
  const babelCommonConfig = getBabelConfig(require('./babel/common.config'));
  const babelTargetConfig = getBabelConfig(require(`./babel/${target}.config`));
  const babelModeConfig = getBabelConfig(require(`./babel/${mode}.config`));

  return merge.smart(
    webpackCommonConfig,
    webpackTargetConfig,
    webpackModeConfig,
    babelCommonConfig,
    babelTargetConfig,
    babelModeConfig,
    {
      name: `${target}-${mode}`,
    }
  );
};
