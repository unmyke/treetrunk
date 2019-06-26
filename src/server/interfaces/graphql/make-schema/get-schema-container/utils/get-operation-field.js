import { extendType } from 'nexus';

import * as operationTypes from './operation-types';

const getOperationField = (ctx) => {
  const {
    types: { Query, Mutation },
    utils: { getTypeMutation },
  } = ctx;

  return (type) => {
    return (getOperationField, typeName) => {
      const exendedType =
        type === operationTypes.QUERY
          ? Query
          : typeName
          ? getTypeMutation(typeName)
          : Mutation;

      const { name, ...operation } = getOperationField(ctx);

      const operationField = extendType({
        type: exendedType.name,
        definition: (t) => {
          t.field(name, operation);
        },
      });
      return operationField;
    };
  };
};

export default getOperationField;
