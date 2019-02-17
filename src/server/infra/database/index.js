import { Database } from 'mongorito';
import config from '@config';
import * as models from './models';
import modelLoader from './model-loader';
import { errors } from '@domain';

const getUrl = ({ db, host, port }) => {
  const protocol = 'mongodb';

  return `${protocol}://${host}:${port}/${db}`;
};

const { db: dbConfig } = config;
if (!dbConfig) {
  throw errors.databaseError(
    'Database config file not found, disabling database.'
  );
}

const { host, port, db, user, pass, ...options } = dbConfig;
const auth = user ? { user, password: pass } : undefined;
const url = getUrl({ host, port, db });
const dbOptions = { auth, ...options };

const database = new Database(url, dbOptions);
modelLoader(models, database);

export { database, models };
