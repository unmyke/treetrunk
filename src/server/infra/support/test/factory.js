import { factory as factoryG, SequelizeAdapter } from 'factory-girl';
import { loadFactories } from 'src/infra/support/load-factories';
import { db } from 'src/infra/database/models';
import * as factories from './factories';

const { models } = db;

const factoryGirl = new factoryG.FactoryGirl();
factoryGirl.setAdapter(new SequelizeAdapter());

export const factory = loadFactories({
  factoryGirl,
  models,
  factories,
});
