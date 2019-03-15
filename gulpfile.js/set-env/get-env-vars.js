const { src } = require('gulp');
const dotenv = require('gulp-dotenv');
const setEnv = require('gulp-env');
const path = require('path');

const envsPath = '.env';

module.exports = (env) =>
  src(path.resolve(envsPath, `.${env}`))
    .pipe(dotenv())
    .pipe(setEnv());
