const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');

const getGlob = require('./get-globs');
const {
  types: {
    dirs: { SRC }
  },
  dirs: { [SRC]: srcDir },
  babelOptions
} = require('../../constants');
const { getDstPath } = require('../path-utils');

module.exports = ({ target, env }) =>
  src(getGlob(target))
    .pipe(sourcemaps.init())
    .pipe(babel(babelOptions[target][env]))
    .pipe(
      sourcemaps.write('.', {
        includeContent: false,
        sourceRoot: `../../${srcDir}`
      })
    )
    .pipe(dest(getDstPath(target)));
