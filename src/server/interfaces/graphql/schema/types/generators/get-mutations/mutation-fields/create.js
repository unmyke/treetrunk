import { mutationField } from 'nexus';

import { CRUDS } from '@common';
import getResolver from '../../get-resolver';

const createTypeMutationField = (type, args) => {
  const { name: typeName } = type;
  const { getOperationName: getMutationName } = CRUDS.CREATE;

  return {
    [typeName]: mutationField(getMutationName(typeName), {
      type,
      args: args[CRUDS.CREATE.name],
      resolve: getResolver(type, CRUDS.CREATE),
    }),
  };
};

export default createTypeMutationField;
