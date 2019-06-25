import { lowerFirst } from 'lodash';
import { extendType } from 'nexus';

const getTypeMutationField = (ctx) => {
  const {
    types: { Mutation },
    utils: { getTypeMutation },
  } = ctx;

  return (typeName) => {
    const typeMutation = getTypeMutation(typeName);

    return extendType({
      type: Mutation.name,
      definition: (t) => {
        t.field(lowerFirst(typeName), { type: typeMutation });
      },
    });
  };
};
export default getTypeMutationField;
