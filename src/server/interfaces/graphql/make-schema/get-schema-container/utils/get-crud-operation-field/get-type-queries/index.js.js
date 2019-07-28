import { queryField } from 'nexus';

import { CRUDS } from '@common';
import getTypeQueryName from './get-type-query-name';
import getTypeListQueryName from './get-type-list-query-name';

const getTypeQueries = (ctx) => {
  const {
    types,
    connections,
    args: { id: idArgs, list: listArgs },
    cruds,
    utils: { getTypeResolver },
  } = ctx;
  const getCrudName = cruds[CRUDS.GET];
  const getListCrudName = cruds[CRUDS.GET];

  return () => {
    Object.entries(cruds).reduce(
      (
        prevQueries,
        [typeName, { [getCrudName]: hasGet, [getListCrudName]: hasGetList }]
      ) => {
        const type = types[typeName];
        const typeConnection = connections[typeName];

        const typeQueryName = getTypeQueryName(type);
        const typeListQueryName = getTypeListQueryName(type);
        const typeQuery = hasGet
          ? {
              [typeQueryName]: queryField(typeQueryName, {
                type,
                args: idArgs,
                resolve: getTypeResolver({ type, crudName: getCrudName }),
              }),
            }
          : {};
        const typeListQuery = hasGetList
          ? {
              [typeListQueryName]: queryField(typeListQueryName, {
                typeConnection,
                args: listArgs,
                resolve: getTypeResolver({ type, crudName: getListCrudName }),
              }),
            }
          : {};
        return {
          ...prevQueries,
          ...typeQuery,
          ...typeListQuery,
        };
      }
    );
  };
};
export default getTypeQueries;
