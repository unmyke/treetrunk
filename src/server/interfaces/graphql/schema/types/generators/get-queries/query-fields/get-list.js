import { queryField } from 'nexus';
import { lowerFirst } from 'lodash/fp';
import pluralize from 'pluralize';

import { CRUDS } from '@common';
import getResolver from '../../get-resolver';
import args from '../../../../args';

const getListQueryField = (type) => {
  const { name: typeName } = type;
  const typesName = lowerFirst(pluralize(typeName));

  return {
    [typesName]: queryField(lowerFirst(typesName), {
      type: `${typeName}Connection`,
      args: args[CRUDS.GET_LIST.name],
      resolve: getResolver(type, CRUDS.GET_LIST),
    }),
  };
};

export default getListQueryField;
