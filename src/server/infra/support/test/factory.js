import { factory as factoryG, MongooseAdapter } from 'factory-girl';
import { loadFactories } from '@infra/support/load-factories';
import container from '@container';
import * as factories from './factories';

const { models } = container;

const factoryGirl = new factoryG.FactoryGirl();
factoryGirl.setAdapter(new MongooseAdapter());

const factory = loadFactories({
  factoryGirl,
  models,
  factories,
});

export default factory;
