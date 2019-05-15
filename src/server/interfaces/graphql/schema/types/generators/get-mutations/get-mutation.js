import { mutationField } from 'nexus';

import getResolver from '../get-resolver';

const getMutationField = ({ type, operation, args }) => {
  const { getOperationName: getMutationName } = operation;
  const { name: typeName } = type;

  return {
    [getMutationName(typeName)]: mutationField(getMutationName(typeName), {
      type,
      args,
      resolve: getResolver(type, operation),
    }),
  };
};

export default getMutationField;
