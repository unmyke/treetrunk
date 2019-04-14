const { resolve } = require('path');
const alias = require('../gulpfile.js/constants/alias/');

const configKey = '@config';

const getAlias = (aliasKey, targetAlias) => {
  if (aliasKey === configKey) return {};

  const cwdRegExp = new RegExp(process.cwd());
  const targetRexExp = `${targetAlias[aliasKey].replace(
    cwdRegExp,
    '<rootDir>'
  )}$1`;

  return {
    [`^${aliasKey}(.*)$`]: targetRexExp,
  };
};

const names = Object.values(alias).reduce((prevTargetMapper, targetAlias) => {
  return Object.keys(targetAlias).reduce(
    (prevMapper, aliasKey) => ({
      ...prevMapper,
      ...getAlias(aliasKey, targetAlias),
    }),
    prevTargetMapper
  );
}, {});

module.exports = {
  ...names,
  '@config': resolve(__dirname, 'config'),
};
