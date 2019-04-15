const { resolve, relative, normalize } = require('path');

const {
  dirs: { SRC },
} = require('../types');
const { [SRC]: srcDir } = require('../dirs');
const aliases = require('../aliases');

module.exports = (target) => {
  const root = `./${resolve(srcDir, target)}`;
  const targetAliases = aliases[target];
  const config = resolve(__dirname, 'config', target);

  const getPlugin = ({ alias, root }) => [
    'module-resolver',
    { root: `./${relative(process.cwd(), root)}`, alias },
  ];

  const getAlias = ({ root, targetAliases, aliasKey }) => {
    if (aliasKey === '@config') {
      return { [aliasKey]: () => config };
    }
    const alias = normalize(relative(root, targetAliases[aliasKey]));

    const key = `^${aliasKey}(.*)$`;
    const value = `./${alias}\\1`;

    return { [key]: value };
  };

  return getPlugin({
    alias: Object.keys(targetAliases).reduce(
      (prevAliases, aliasKey) => ({
        ...prevAliases,
        ...getAlias({ root, targetAliases, aliasKey }),
      }),
      {}
    ),
    root,
  });
};
