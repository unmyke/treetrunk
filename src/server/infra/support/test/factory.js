import { factory as factoryG, MongooseAdapter } from 'factory-girl';
import container from '@container';

import loadFactories from './load-factories';
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
