import { Database } from 'mongorito';
import models, { plugins as modelsPlugins } from './models';
import modelLoader from './model-loader';

export default ({ config: { database: config }, errors }) => {
  const getUrl = ({ name, host, port }) => {
    const protocol = 'mongodb';

    return `${protocol}://${host}${port ? `:${port}` : ''}/${name}`;
  };

  if (!config) {
    throw errors.databaseError(
      'Database config file not found, disabling database.'
    );
  }

  const { host, port, name, user, pass, ...options } = config;
  const auth = user ? { user, password: pass } : undefined;
  const url = getUrl({ host, port, name });
  const dbOptions = { auth, ...options };

  const database = new Database(url, dbOptions);

  modelLoader({ models, database, modelsPlugins });

  return { database, models };
};
