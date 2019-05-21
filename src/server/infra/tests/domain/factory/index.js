import { factory as factoryG } from 'factory-girl';

import MongoritoAdapter from './mongorito-adapter';
import loadFactories from './load-factories';
import * as factories from './factories';

const factoryGirl = new factoryG.FactoryGirl();

const Factory = ({ models, database }) => {
  factoryGirl.setAdapter(MongoritoAdapter({ database }));

  const factory = loadFactories({
    factoryGirl,
    models,
    factories,
  });

  return factory;
};

export default Factory;
