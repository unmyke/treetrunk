const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const { inspect } = require('util');

const { PROD, DEV } = require('./envs');
const {
  server: { src: srcGlob, dest: destPath },
} = require('./target-globs');
const getBabelConfig = require('./get-babel-config');

const getTask = (env) => {
  const config = getBabelConfig({ env, target: 'server' });
  console.log(inspect(config, { depth: null, colors: true }));

  return src(srcGlob)
    .pipe(babel(config))
    .pipe(dest(destPath));
};

const transpileProdution = () => getTask(PROD);
const transpileDevelopment = () => getTask(DEV);

module.exports = {
  [PROD]: transpileProdution,
  [DEV]: transpileDevelopment,
};
