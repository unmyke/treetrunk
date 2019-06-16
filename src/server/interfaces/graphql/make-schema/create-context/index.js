import Bottle from 'bottlejs';

import makeGetResolver from './make-get-resolver';
import getNestedContainersFactory from './get-nested-containers-factory';

import operations from './operations';

import * as factories from './factories';

import * as scalars from './scalars';
import * as enums from './enums';
import * as argsParsers from './args-parsers';

import getTypeConnection from './get-connection';
import getTypeOperations from './get-operations';
import getTypeOperationArgs from './get-operation-args';
import getOperationTypes from './get-operation-types';

const createContext = (getServiceName) => {
  const bottle = new Bottle();

  const createNestedFactories = getNestedContainersFactory({
    bottle,
    type: 'factory',
  });
  createNestedFactories(factories);

  const getTypeResolvers = makeGetResolver(getServiceName);
  const operationTypes = getOperationTypes(getServiceName);

  const constants = {
    enums,
    argsParsers,
    scalars,
    operationTypes,
  };
  const createNestedConstants = getNestedContainersFactory({
    bottle,
    type: 'constant',
  });
  createNestedConstants(constants);

  const utils = {
    getTypeConnection,
    getTypeOperations,
    getTypeOperationArgs,
    getTypeResolvers,
  };
  const createUtilsNestedConstants = getNestedContainersFactory({
    bottle,
    type: 'constant',
    name: 'utils',
  });
  createUtilsNestedConstants(utils);

  const context = bottle.container;

  return context;
};

export default createContext;
