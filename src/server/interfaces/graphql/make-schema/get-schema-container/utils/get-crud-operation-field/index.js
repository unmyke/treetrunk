import getQueryName from './get-query-name';
import getOutputType from './get-output-type';
import getArgs from './get-args';

import { crudPredicates } from '@common';

const { isGetter } = crudPredicates;

const getCrudOperations = (ctx) => {
  const {
    utils: { getMutationField, getQueryField },
  } = ctx;

  return (crudName) => {
    const isQuery = isGetter(crudName);
    const getOperationField = isQuery ? getQueryField : getMutationField;

    return (type, opts) => {
      const name = isQuery ? getQueryName({ type, crudName }) : crudName;
      const outputType = getOutputType({ ctx, crudName, type });
      const args = getArgs({ ctx, crudName, type });

      return getOperationField(
        {
          name,
          type: outputType,
          args,
          ...opts,
        },
        isQuery ? undefined : type
      );
    };
  };
};
export default getCrudOperations;
