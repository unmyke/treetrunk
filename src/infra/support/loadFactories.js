import { getSubdomainsContainer } from './containerHelpers';

export const loadFactories = ({ factoryGirl, models, factories }) => {
  const factoryContainer = getSubdomainsContainer(
    factories,
    (factory, SubdomainName) => {
      factory(factoryGirl, models[SubdomainName]);
    }
  );

  return factoryGirl;
};
