import Sequelize from 'sequelize';
import { ModelsLoader } from 'src/infra/sequelize';
import { config } from 'config';
import { SellerManagement } from './SellerManagement';

const subdomains = { SellerManagement };

const { db: dbConfig } = config;
let db;

if (dbConfig) {
  const sequelize = new Sequelize(dbConfig);

  db = ModelsLoader.load({
    sequelize,
    subdomains,
  });
} else {
  /* eslint-disable no-console */
  console.error('Database config file log found, disabling database.');
  /* eslint-enable no-console */
}

export { db };
