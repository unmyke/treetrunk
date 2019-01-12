/* eslint-disable global-require */
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// eslint-disable-next-line consistent-return
function loadDbConfig() {
  // if (process.env.DATABASE_URL) {
  //   return process.env.DATABASE_URL;
  // }

  if (fs.existsSync(path.join(__dirname, './database.js'))) {
    // eslint-disable-next-line global-require
    // eslint-disable-next-line no-use-before-define
    return require('./database')[ENV];
  }
}

function loadAppConfig() {
  return require('./application');
}

dotenv.load();

const ENV = process.env.NODE_ENV || 'development';

// eslint-disable-next-line import/no-dynamic-require
const { envConfig } = require(path.join(__dirname, 'environments', ENV));
const dbConfig = loadDbConfig();
const appConfig = loadAppConfig();

exports.config = Object.assign(
  {
    [ENV]: true,
    env: ENV,
    db: dbConfig,
    app: appConfig,
  },
  envConfig
);
