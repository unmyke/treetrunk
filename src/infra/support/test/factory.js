import path from 'path';
import { factory as factoryG, SequelizeAdapter } from 'factory-girl';
import { loadFactories } from 'src/infra/support/loadFactories';
import { db } from 'src/infra/database/models';

const { models } = db;

const factoryGirl = new factoryG.FactoryGirl();
factoryGirl.setAdapter(new SequelizeAdapter());

export const factory = loadFactories({
  factoryGirl,
  models,
  baseFolder: path.join(__dirname, 'factories'),
});
