import { mutationField } from 'nexus';

import { CRUDS } from '@common';
import getResolver from '../../get-resolver';

const updateTypeMutationField = (type, args) => {
  const { name: typeName } = type;
  const { getOperationName: getMutationName } = CRUDS.UPDATE;

  return {
    [typeName]: mutationField(getMutationName(typeName), {
      type,
      args: args[CRUDS.UPDATE.name],
      resolve: getResolver(type, CRUDS.UPDATE),
    }),
  };
};

export default updateTypeMutationField;
