import getTypeQueryName from './get-type-query-name';
import getTypeListQueryName from './get-type-list-query-name';
import getOutputType from './get-output-type';

import { CRUDS, crudPredicates } from '@common';

const { isListGetter, isMultipleSetter, isSetter, isGetter } = crudPredicates;

const getCrudOperations = (ctx) => {
  const {
    utils: { getTypeResolver, getMutationField, getQueryField },
  } = ctx;

  return (crudName) => {
    const getOperationField = isGetter ? getQueryField : getMutationField;

    return (type, opts) => {
      getOperationField({
        type: getOutputType({ ctx, crudName, type }),
        args: getArgs({ ctx, crudName, type }),
        ...opts,
      });
    };
  };
};
export default getCrudOperations;
