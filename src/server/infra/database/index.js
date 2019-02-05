import { Database } from 'mongorito';
import config from '@config';
import * as models from './models';
import modelLoader from './model-loader';

const getUrl = ({ db, host, port }) => {
  const protocol = 'mongodb';

  return `${protocol}://${host}${port}/${db}`;
};

const { db: dbConfig } = config;
let database;

if (dbConfig) {
  const { host, port, db, user, pass, ...options } = dbConfig;
  const auth = user ? { user, password: pass } : undefined;

  database = new Database(getUrl({ host, port, db }), { auth, ...options });

  database.connect().then(
    () => {
      console.log('Database connection successful.');
      modelLoader(models, db);
    },
    ({ message }) => console.error(`Database connection error: ${message}`)
  );
} else {
  /* eslint-disable no-console */
  console.error('Database config file found, disabling database.');
  /* eslint-enable no-console */
}

export { database, models };
