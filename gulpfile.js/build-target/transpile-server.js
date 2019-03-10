const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const getTargetGlobs = require('../get-target-globs');

const invalidModeRejectedPromise = require('./invalid-mode-rejected-promise');
const getBabelConfig = require('../get-babel-config');

const { src: srcGlob, dest: destPath } = getTargetGlobs('server');
const getTask = (env) => () =>
  src(srcGlob)
    .pipe(babel(getBabelConfig({ env, target: 'server' })))
    .pipe(dest(destPath));

const transpileProdution = getTask('production');
const transpileDevelopment = getTask('development');

module.exports = (env) => {
  switch (env) {
    case 'production':
      return transpileProdution;

    case 'development':
      return transpileDevelopment;

    default:
      return invalidModeRejectedPromise(env);
  }
};
