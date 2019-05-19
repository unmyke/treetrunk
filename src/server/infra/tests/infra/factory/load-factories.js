import { forEachSubdomain } from '@infra/support/container-helpers';

const loadFactories = ({ factoryGirl, models, factories }) => {
  forEachSubdomain(factories, factoryGirl, (factory, factoryGirl) => {
    factory(factoryGirl, models);
  });

  return factoryGirl;
};

export default loadFactories;
