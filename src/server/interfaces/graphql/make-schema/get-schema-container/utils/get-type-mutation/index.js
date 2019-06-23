import { extendType } from 'nexus';
import getRootTypeMutation from './get-root-type-mutation';

const getTypeMutation = (type) => {
  const rootTypeMutationName = `${type.name}Mutations`;

  return extendType({
    type: 'Mutation',
    definition(t) {
      t.field(rootTypeMutationName, {});
    },
  });
};
export default getTypeMutation;
