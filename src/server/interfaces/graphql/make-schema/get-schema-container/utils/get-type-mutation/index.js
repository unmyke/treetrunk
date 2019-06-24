import { extendType } from 'nexus';
import getTypeMutationName from './get-type-mutation-name';

const getTypeMutation = (ctx) => {
  const {
    types: { Mutation },
  } = ctx;
  const typeMutations = new Map();

  return ({ name: typeName }) => {
    if (typeMutations.get(typeName)) return typeMutations.get(typeName);

    const typeMutationName = getTypeMutationName(typeName);
    const typeMutation = extendType({
      type: Mutation.name,
      definition: (t) => {
        t.field(typeMutationName, {
          type: objectType({
            name: typeMutationName,
            definition: () => {},
          }),
        });
      },
    });
    typeMutations.set(typeName, typeMutation);

    return typeMutation;
  };
};
export default getTypeMutation;
