import { factory as factoryG } from 'factory-girl';

import EntityAdapter from './entity-adapter';
import store from './store';
import loadFactories from './load-factories';
import * as factories from './factories';

const factoryGirl = new factoryG.FactoryGirl();

const Factory = ({ entities, commonTypes }) => {
  factoryGirl.setAdapter(EntityAdapter(store));

  const factory = loadFactories({
    factoryGirl,
    entities,
    commonTypes,
    factories,
  });

  return factory;
};

export default Factory;
