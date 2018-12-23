import { getSubdomainsContainer } from './container-helpers';

export const loadFactories = ({ factoryGirl, models, factories }) => {
  const factoryContainer = getSubdomainsContainer(
    factories,
    (factory, SubdomainName) => {
      factory(factoryGirl, models[SubdomainName]);
    }
  );

  return factoryGirl;
};
