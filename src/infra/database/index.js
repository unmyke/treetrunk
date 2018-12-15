import mongoose from 'mongoose';
import { config } from 'config';
import * as models from './models';

const getUrl = ({ dbName, ...options }) => {
  const protocol = 'mongodb';
  const host = options.host ? options.host : 'localhost';
  const port = options.port ? `:${options.port}` : '';

  return `${protocol}://${host}${port}/${dbName}`;
};

const { db: dbConfig } = config;
let database;

if (dbConfig) {
  const { host, port, dbName, ...options } = dbConfig;
  mongoose.connect(
    getUrl({ host, port, dbName }),
    options
  );
  database = mongoose.connection;

  database.on('error', ({ message }) => {
    console.error(`Database connection error: ${message}`);
  });

  database.once('open', () => {
    console.log('Database connection successful.');
  });
} else {
  /* eslint-disable no-console */
  console.error('Database config file found, disabling database.');
  /* eslint-enable no-console */
}

export { database, models };
