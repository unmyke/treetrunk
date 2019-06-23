import Bottle from 'bottlejs';

import {
  getNestedContainerFactories,
  getNestedContainerFactory,
  createGetResolver,
  nestedContainerTypes,
} from './container-utils';

// import getOperationTypes from './get-operation-types';

// import operations from './operations';
// import crudOperations from './crud'

import * as constants from './constants';
import * as factories from './factories';
import * as containerResolvers from './container-resolvers';
import * as utils from './utils';

const getSchemaContainer = (getServiceName) => {
  const bottle = new Bottle();

  // schema entires :: by constants
  // const operationTypes = getOperationTypes(getServiceName);
  const createNestedConstants = getNestedContainerFactories({
    bottle,
    type: nestedContainerTypes.CONSTANT,
  });
  createNestedConstants({
    ...constants,
    // operationTypes,
  });

  // schema entires :: by factories
  const createNestedFactories = getNestedContainerFactories({
    bottle,
    type: nestedContainerTypes.FACTORY,
  });
  createNestedFactories(factories);

  // schema entries :: by dynamic
  const createNestedDynamicsByResolvers = getNestedContainerFactories({
    bottle,
    type: nestedContainerTypes.DYNAMIC,
  });
  createNestedDynamicsByResolvers(containerResolvers);

  // schema builder utils
  const getTypeResolvers = createGetResolver(getServiceName);

  const createNestedUtils = getNestedContainerFactory({
    bottle,
    type: nestedContainerTypes.FACTORY,
    name: 'utils',
  });
  createNestedUtils({ ...utils, getTypeResolvers });

  const { container } = bottle;
  return container;
};

export default getSchemaContainer;
