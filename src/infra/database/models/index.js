import Sequelize from 'sequelize';
import { ModelsLoader } from '../ModelsLoader';
import { config } from 'config';

const { db: dbConfig } = config;
let db;

if (dbConfig) {
  const sequelize = new Sequelize(dbConfig);

  db = ModelsLoader.load({
    sequelize,
    baseFolder: __dirname,
    DataTypes: Sequelize.DataTypes,
  });
} else {
  /* eslint-disable no-console */
  console.error('Database config file log found, disabling database.');
  /* eslint-enable no-console */
}

export { db };
