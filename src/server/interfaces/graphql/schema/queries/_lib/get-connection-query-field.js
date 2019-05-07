import { queryField, idArg } from 'nexus';
import { lowerFirst } from 'lodash/fp';
import pluralize from 'pluralize';

import * as resolvers from '../../resolvers';
import connections from '../../connections';

const getConnectionQueryField = (typeName) => {
  const typesName = pluralize(typeName);

  return queryField(lowerFirst(typesName), {
    type: connections[typeName],
    args: { id: idArg({ required: true }) },
    resolve: resolvers[`get${typesName}`],
  });
};

export default getConnectionQueryField;
