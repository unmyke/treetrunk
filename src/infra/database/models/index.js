import Sequelize from 'sequelize';
import { ModelsLoader } from '../sequelize';
import { config } from 'config';

const { db: dbConfig } = config;
let db;

if (dbConfig) {
  const sequelize = new Sequelize(dbConfig);

  db = ModelsLoader.load({
    sequelize,
    baseFolder: __dirname
  });
} else {
  /* eslint-disable no-console */
  console.error('Database config file log found, disabling database.');
  /* eslint-enable no-console */
}

export { db };
