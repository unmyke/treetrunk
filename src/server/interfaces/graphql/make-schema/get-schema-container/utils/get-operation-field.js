import { extendType } from 'nexus';

import * as operationTypes from './operation-types';

const getOperationField = (ctx) => {
  const {
    types: { Query, Mutation },
    utils: { getTypeMutation },
  } = ctx;

  return (operationType) => (
    { name, ...operation },
    { name: typeName } = {}
  ) => {
    const exendedType =
      operationType === operationTypes.QUERY
        ? Query
        : typeName
        ? getTypeMutation(typeName)
        : Mutation;

    const operationField = extendType({
      // type: exendedType,
      type: exendedType.name,
      definition: (t) => {
        t.field(name, operation);
      },
    });
    return operationField;
  };
};

export default getOperationField;
