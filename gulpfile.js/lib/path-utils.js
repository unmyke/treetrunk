const { resolve } = require('path');
const {
  dirs: { DST, SRC }
} = require('../constants/types');
const { [DST]: dstDir, [SRC]: srcDir } = require('../constants/dirs');

const getPath = dir => (...target) => resolve(dir, ...target);

module.exports = {
  getDstPath: getPath(dstDir),
  getSrcPath: getPath(srcDir)
};
