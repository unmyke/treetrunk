import { extendType, objectType } from 'nexus';
import getTypeMutationName from './get-type-mutation-name';

const getTypeMutation = (ctx) => {
  const { types } = ctx;
  const { Mutation } = types;
  const typeMutations = new Map();

  // return ({ name: typeName}) => {
  return (typeName) => {
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
