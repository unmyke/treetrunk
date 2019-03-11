const { src, dest } = require('gulp');
const babel = require('gulp-babel');

const {
  server: { src: srcGlob, dest: destPath },
} = require('../target-globs');
const getBabelConfig = require('../get-babel-config');

const getTask = (env) =>
  src(srcGlob)
    .pipe(babel(getBabelConfig({ env, target: 'server' })))
    .pipe(dest(destPath));

const transpileProdution = () => getTask('production');
const transpileDevelopment = () => getTask('development');

module.exports = {
  production: transpileProdution,
  development: transpileDevelopment,
};
