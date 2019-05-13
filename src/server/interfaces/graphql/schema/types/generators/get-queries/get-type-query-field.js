import { queryField } from 'nexus';
import { lowerFirst } from 'lodash/fp';

import { CRUDS } from '@common';
import getResolver from '../get-resolver';
import { entity as entitySerializer } from '../resolver-serializer';
import args from '../../../args';

const { Type: TypeArgs } = args;

const getTypeQueryField = (type) => {
  const { name: typeName } = type;

  return {
    [typeName]: queryField(lowerFirst(typeName), {
      type: typeName,
      args: TypeArgs,
      resolve: entitySerializer(type, getResolver(type, CRUDS.GET)),
    }),
  };
};

export default getTypeQueryField;
