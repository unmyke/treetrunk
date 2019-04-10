import { Database } from 'mongorito';
import * as models from './models';
import modelLoader from './model-loader';

export default ({ config: { database: config }, errors }) => {
  const getUrl = ({ db, host, port }) => {
    const protocol = 'mongodb';

    return `${protocol}://${host}:${port}/${db}`;
  };

  if (!config) {
    throw errors.databaseError(
      'Database config file not found, disabling database.'
    );
  }

  const { host, port, db, user, pass, ...options } = config;
  const auth = user ? { user, password: pass } : undefined;
  const url = getUrl({ host, port, db });
  const dbOptions = { auth, ...options };

  const database = new Database(url, dbOptions);
  modelLoader(models, database);

  return { database, models };
};
