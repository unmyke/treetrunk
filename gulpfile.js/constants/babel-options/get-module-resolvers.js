const { resolve } = require('path');
const aliases = require('../alias');

const getPlugin = (alias) => ['module-resolver', { alias }];
const getAlias = ({ target, aliases, aliasKey }) => {
  if (aliasKey === '@config') {
    return { [aliasKey]: () => resolve(__dirname, 'config', target) };
  }
  const alias = aliases[target][aliasKey];
  const key = `^${aliasKey}(.*)$`;
  const value = `${alias}\\1`;

  return { [key]: value };
};

module.exports = (target) =>
  getPlugin(
    Object.keys(aliases[target]).reduce(
      (prevAlias, aliasKey) => ({
        ...prevAlias,
        ...getAlias({ target, aliases, aliasKey }),
      }),
      {}
    )
  );
