import { queryField, arg, intArg } from 'nexus';
import { lowerFirst } from 'lodash/fp';
import pluralize from 'pluralize';

import * as resolvers from '../../resolvers';
import connections from '../../connections';
import { Cursor as CursorScalar } from '../../scalars';
import SortInput from '../sort-input';
import FilterInput from '../filter-input';

const getConnectionQueryField = (typeName) => {
  const typesName = pluralize(typeName);

  return queryField(lowerFirst(typesName), {
    type: connections[typeName],
    args: {
      first: intArg(),
      after: arg({ type: CursorScalar }),
      last: intArg(),
      before: arg({ type: CursorScalar }),
      skip: intArg(),
      filter: arg({ type: FilterInput }),
      sort: arg({ type: SortInput }),
    },
    resolve: resolvers[`get${typesName}`],
  });
};

export default getConnectionQueryField;
