import Bottle from 'bottlejs';

import makeGetResolver from './make-get-resolver';
import getNestedContainersFactory from './get-nested-containers-factory';

import operations from './operations';

import * as factories from './factories';
import * as constants from './constants';

import {
  getTypeConnection,
  getTypeOperations,
  getTypeOperationArgs,
  getOperationTypes,
} from './utils';

const createContext = (getServiceName) => {
  const bottle = new Bottle();

  const createNestedFactories = getNestedContainersFactory({
    bottle,
    type: 'factory',
  });
  createNestedFactories(factories);

  const getTypeResolvers = makeGetResolver(getServiceName);
  const operationTypes = getOperationTypes(getServiceName);

  const createNestedConstants = getNestedContainersFactory({
    bottle,
    type: 'constant',
  });
  createNestedConstants({ ...constants, operations, operationTypes });

  const utils = {
    getTypeConnection,
    getTypeOperations,
    getTypeOperationArgs,
    getTypeResolvers,
  };
  const createUtilsNestedUtils = getNestedContainersFactory({
    bottle,
    type: 'factory',
    name: 'utils',
  });
  createUtilsNestedUtils(utils);

  const context = bottle.container;

  return context;
};

export default createContext;
