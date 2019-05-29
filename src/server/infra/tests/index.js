import * as infra from './infra';
import * as interfaces from './interfaces';
import * as jest from './jest';

const testUtils = { infra, interfaces, jest };

const tests = (container) =>
  Object.keys(testUtils).reduce((prevLayerUtils, layerName) => {
    const layerUtilGetters = testUtils[layerName];

    const layerUtils = Object.keys(layerUtilGetters).reduce(
      (prevUtils, utilName) => ({
        ...prevUtils,
        [utilName]: layerUtilGetters[utilName](container),
      }),
      {}
    );

    return {
      ...prevLayerUtils,
      [layerName]: layerUtils,
    };
  }, {});

export default tests;
