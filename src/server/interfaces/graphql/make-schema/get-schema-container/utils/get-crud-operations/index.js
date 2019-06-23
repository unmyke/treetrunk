import { queryField } from 'nexus';

import getTypeQueryName from './get-type-query-name';
import getTypeListQueryName from './get-type-list-query-name';

import { CRUDS, crudPredicates } from '@common';

const { isListGetter, isMultipleSetter, isSetter, isGetter } = crudPredicates;

const getCrudOperations = (ctx) => {
  const {
    types,
    cruds,
    utils: { getResolver },
  } = ctx;

  return Object.entries(cruds).reduce(
    (prevCrudsOperations, [typeName, typeCrudOpts]) => {
      const type = types[typeName];

      return {
        ...prevCrudsOperations,
        ...Object.entries(typeCrudOpts).reduce(
          (prevOperations, [crudName, hasCrud]) => {
            const crudTypeOperation = hasCrud
              ? getCrudOperation({
                  type,
                  crudName,
                  args,
                  resolver: getResolver({ type, crudName }),
                })
              : {};
            return {
              ...prevOperations,
              ...crudTypeOperation,
            };
          }
        ),
      };
    },
    {}
  );
};
export default getCrudOperations;
