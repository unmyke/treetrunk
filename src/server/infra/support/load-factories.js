import { forEachSubdomain } from './container-helpers';

export const loadFactories = ({ factoryGirl, models, factories }) => {
  forEachSubdomain(
    factories,
    factoryGirl,
    (factory, factoryGirl, SubdomainName) => {
      factory(factoryGirl, models[SubdomainName]);
    }
  );

  return factoryGirl;
};
