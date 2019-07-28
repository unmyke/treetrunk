import { extendType } from 'nexus';

import { crudPredicates } from '@common';
import getOperationType from './get-operation-type';
import getOperationName from './get-operation-name';
import getOutputType from './get-output-type';

const { isMultipleSetter } = crudPredicates;

const getOperationField = ({ type, crudName, args, getResolver }) => {
  const operationName = getOperationName({ type, crudName });

  return {
    [operationName]: extendType({
      type: getOperationType(crudName),
      definition: (t) => {
        (isMultipleSetter(crudName) ? t.list : t).field(operationName, {
          type: getOutputType({ type, crudName }),
          args: args[crudName],
          resolve: getResolver({ crudName, type }),
        });
      },
    }),
  };
};

export default getOperationField;
