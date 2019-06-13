import { errors } from '@domain/errors';

const injectOptionToFactory = (factoryOptionInjectors) => (Factory) => {
  let injectors;

  switch (true) {
    case Array.isArray(factoryOptionInjectors):
      injectors = factoryOptionInjectors;
      break;
    case factoryOptionInjectors instanceof Object:
      injectors = Object.values(factoryOptionInjectors);
      break;
    default:
      throw errors.creationCommonType(
        `only Object or Array of injectors for ${Factory.name} must be passed to 'injectOptionToFactory'`
      );
  }

  return injectors.reduce((prevFactory, factoryOptionInjector) => {
    if (typeof factoryOptionInjector !== 'function')
      throw errors.creationCommonType(
        `Factory option injector must be function, but passed ${factoryOptionInjector}`
      );
    return factoryOptionInjector(prevFactory);
  }, Factory);
};
export default injectOptionToFactory;
