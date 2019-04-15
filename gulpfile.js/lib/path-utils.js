const { resolve, relative, normalize } = require('path');
const {
  dirs: { DST, SRC },
} = require('../constants/types');
const { [DST]: dstDir, [SRC]: srcDir } = require('../constants/dirs');

const rootDir = process.cwd();

const parseArgs = (args) => {
  const options = args[args.length - 1];
  if (options instanceof Object) {
    return {
      paths: args.slice(0, -1),
      absolute: !!options.absolute,
    };
  }

  return { paths: [...args], absolute: false };
};

const getPath = (dir) => (...args) => {
  const { paths, absolute } = parseArgs(args);
  const relativePath = `./${normalize(
    relative(rootDir, resolve(dir, ...paths))
  )}`;

  if (absolute) return resolve(relativePath);
  return relativePath;
};

module.exports = {
  getDstPath: getPath(dstDir),
  getSrcPath: getPath(srcDir),
};
