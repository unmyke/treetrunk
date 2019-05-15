import { queryField } from 'nexus';
import { lowerFirst } from 'lodash/fp';

import { CRUDS } from '@common';
import getResolver from '../../get-resolver';
import args from '../../../../args';

const getTypeQueryField = (type) => {
  const { name: typeName } = type;

  return {
    [typeName]: queryField(lowerFirst(typeName), {
      type,
      args: args[CRUDS.GET_LIST.name],
      resolve: getResolver(type, CRUDS.GET),
    }),
  };
};

export default getTypeQueryField;
