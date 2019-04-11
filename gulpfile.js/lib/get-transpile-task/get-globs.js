const {
  types: {
    dirs: { SRC },
    targets: { SERVER, COMMON, CLIENT },
    globs: { NODE, REACT }
  },
  globs: { [NODE]: nodeGlobs, [REACT]: reactGlobs },
  dirs: { [SRC]: srcDir }
} = require("../../constants");

const globs = {
  [SERVER]: nodeGlobs,
  [COMMON]: nodeGlobs,
  [CLIENT]: reactGlobs
};

const getGlob = ({ target, glob }) => `${srcDir}/${target}/${glob}`;

module.exports = target => {
  const glob = globs[target];

  if (Array.isArray(glob)) {
    return glob.map(glob => getGlob({ target, glob }));
  }

  return getGlob({ target, glob });
};
