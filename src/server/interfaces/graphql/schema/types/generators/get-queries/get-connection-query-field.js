import { queryField } from 'nexus';
import { lowerFirst } from 'lodash/fp';
import pluralize from 'pluralize';

import args from '../../../args';

const { Connection: ConnectionArgs } = args;

const getConnectionQueryField = (typeName, resolver) => {
  const typesName = pluralize(typeName).toLowerCase();

  return {
    [typesName]: queryField(lowerFirst(typesName), {
      type: `${typeName}Connection`,
      args: ConnectionArgs,
      resolve: resolver,
    }),
  };
};

export default getConnectionQueryField;
