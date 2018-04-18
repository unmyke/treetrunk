import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.load();

const ENV = process.env.NODE_ENV || 'development';

const { envConfig } = require(path.join(__dirname, 'environments', ENV));
const dbConfig = loadDbConfig();

export const config = Object.assign({
  [ENV]: true,
  env: ENV,
  db: dbConfig
}, envConfig);

function loadDbConfig() {
  if(process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  if(fs.existsSync(path.join(__dirname, './database.js'))) {
    return require('./database')[ENV];
  }
}
