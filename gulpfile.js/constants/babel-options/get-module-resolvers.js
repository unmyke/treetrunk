const alias = require('../alias');

const getPlugin = (alias) => ['module-resolver', { alias }];
const getAlias = (targetAlias, aliasKey) => {
  const alias = targetAlias[aliasKey];
  const key = `^${aliasKey}(.*)$`;
  const value = `${alias}\\1`;

  return { [key]: value };
};

module.exports = (target) => {
  const targetAlias = alias[target];

  return getPlugin(
    Object.keys(targetAlias).reduce(
      (prevAlias, targetAliasKey) => ({
        ...prevAlias,
        ...getAlias(targetAlias, targetAliasKey),
      }),
      {}
    )
  );
};
