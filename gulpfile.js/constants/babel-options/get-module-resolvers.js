const { resolve } = require('path');

const aliases = require('../aliases');

module.exports = (target) => {
  const config = resolve(__dirname, 'config', target);
  const targetAliases = aliases[target];

  const getPlugin = (alias) => ['module-resolver', { alias }];

  const getAlias = ({ targetAliases, aliasKey }) => {
    if (aliasKey === '@config') {
      return { [aliasKey]: () => config };
    }
    const alias = targetAliases[aliasKey];

    const key = `^${aliasKey}(.*)$`;
    const value = `${alias}\\1`;

    return { [key]: value };
  };

  return getPlugin(
    Object.keys(targetAliases).reduce(
      (prevAliases, aliasKey) => ({
        ...prevAliases,
        ...getAlias({ targetAliases, aliasKey }),
      }),
      {}
    )
  );
};
