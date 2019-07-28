import { factory as factoryG, MongooseAdapter } from 'factory-girl';

import loadFactories from './load-factories';
import * as factories from './factories';

const factoryGirl = new factoryG.FactoryGirl();

const Factory = ({ models }) => {
  factoryGirl.setAdapter(new MongooseAdapter());

  const factory = loadFactories({
    factoryGirl,
    models,
    factories,
  });

  return factory;
};

export default Factory;
