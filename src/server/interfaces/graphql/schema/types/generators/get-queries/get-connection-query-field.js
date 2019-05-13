import { queryField } from 'nexus';
import { lowerFirst } from 'lodash/fp';
import pluralize from 'pluralize';

import { CRUDS } from '@common';
import getResolver from '../get-resolver';
import { list as listSerializer } from '../resolver-serializer';
import args from '../../../args';

const { Connection: ConnectionArgs } = args;

const getConnectionQueryField = (type) => {
  const { name: typeName } = type;
  const typesName = pluralize(typeName).toLowerCase();

  return {
    [typesName]: queryField(lowerFirst(typesName), {
      type: `${typeName}Connection`,
      args: ConnectionArgs,
      resolve: listSerializer(type, getResolver(type, CRUDS.GET_LIST)),
    }),
  };
};

export default getConnectionQueryField;
