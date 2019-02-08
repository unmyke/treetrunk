import { factory as factoryG, SequelizeAdapter } from 'factory-girl';
import { loadFactories } from '@infra/support/load-factories';
import { db } from '@infra/database/models';
import * as factories from './factories';

const { models } = db;

const factoryGirl = new factoryG.FactoryGirl();
factoryGirl.setAdapter(new SequelizeAdapter());

const factory = loadFactories({
  factoryGirl,
  models,
  factories,
});

export default factory;
