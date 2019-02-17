import { factory as factoryG, MongooseAdapter } from 'factory-girl';
import { loadFactories } from '@infra/support/load-factories';
import { db } from '@infra/database/models';
import * as factories from './factories';

const { models } = db;

const factoryGirl = new factoryG.FactoryGirl();
factoryGirl.setAdapter(new MongooseAdapter());

const factory = loadFactories({
  factoryGirl,
  models,
  factories,
});

export default factory;
