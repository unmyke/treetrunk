const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.load();

const ENV = process.env.NODE_ENV || 'development';

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

function loadDbConfig() {
  // if (process.env.DATABASE_URL) {
  //   return process.env.DATABASE_URL;
  // }

  if (fs.existsSync(path.join(__dirname, './database.js'))) {
    return require('./database')[ENV];
  }
}

function loadAppConfig() {
  return require('./application');
}
