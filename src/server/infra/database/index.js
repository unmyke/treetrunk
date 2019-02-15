import { Database } from 'mongorito';
import config from '@config';
import * as models from './models';
import modelLoader from './model-loader';

const getUrl = ({ db, host, port }) => {
  const protocol = 'mongodb';

  return `${protocol}://${host}:${port}/${db}`;
};

const { db: dbConfig } = config;
const { host, port, db, user, pass, ...options } = dbConfig;
const auth = user ? { user, password: pass } : undefined;
const url = getUrl({ host, port, db });
const dbOptions = { auth, ...options };

let database;

if (dbConfig) {
  database = new Database(url, dbOptions);
  modelLoader(models, database);

  database.connect().then(
    () => {
      console.log('Database connection successful');
    },
    ({ message }) => {
      console.error(`Database connection error: ${message}`);
    }
  );
  // .then(() => database.disconnect());
} else {
  /* eslint-disable no-console */
  console.error('Database config file found, disabling database.');
  /* eslint-enable no-console */
}

export { database, models };
