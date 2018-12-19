import { Database } from 'mongorito';
import { config } from 'config';
// import * as models from './models';

const getUrl = ({ dbName, ...options }) => {
  const protocol = 'mongodb';
  const host = options.host ? options.host : 'localhost';
  const port = options.port ? `:${options.port}` : '';

  return `${protocol}://${host}${port}/${dbName}`;
};

const { db: dbConfig } = config;
let database;

if (dbConfig) {
  const { host, port, dbName, user, pass, ...options } = dbConfig;
  const auth = user ? { user, password: pass } : undefined;

  database = new Database(getUrl({ host, port, dbName }), { auth, ...options });

  database.connect().then(
    () => {
      console.log('Database connection successful.');
    },
    ({ message }) => console.error(`Database connection error: ${message}`)
  );
} else {
  /* eslint-disable no-console */
  console.error('Database config file found, disabling database.');
  /* eslint-enable no-console */
}

export { database, models };
