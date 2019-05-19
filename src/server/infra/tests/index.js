import * as infra from './infra';
import * as interfaces from './interfaces';

const PRODUCTION_MODE = 'production';

const testUtils = { infra, interfaces };

const tests = (container) =>
  container.config.mode !== PRODUCTION_MODE
    ? Object.keys(testUtils).reduce((prevLayerUtils, layerName) => {
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
      }, {})
    : {};

export default tests;
