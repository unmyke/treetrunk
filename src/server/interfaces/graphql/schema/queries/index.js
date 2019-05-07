import { queryType } from 'nexus';
import pluralize from 'pluralize';

import types from '../types';
import { getTypeQueryField, getConnectionQueryField } from './_lib';

const rootQuery = queryType({
  definition() {},
});

const typeQueries = Object.keys(types).reduce(
  (prevTypeQueries, typeName) => ({
    ...prevTypeQueries,
    [typeName]: getTypeQueryField(typeName),
    [pluralize(typeName)]: getConnectionQueryField(typeName),
  }),
  {}
);

export default typeQueries;

export const contains = [rootQuery];
