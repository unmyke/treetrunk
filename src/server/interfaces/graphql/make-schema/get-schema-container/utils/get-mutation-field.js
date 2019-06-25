import { extendType } from 'nexus';

const getMutationFieldFactory = (ctx) => {
  const {
    utils: { getTypeMutation },
  } = ctx;
  return ({ typeName, field: getMutationField }) => {
    const typeMutation = getTypeMutation(typeName);
    const { name, ...mutation } = getMutationField(ctx);

    const mutationField = extendType({
      type: typeMutation.name,
      definition: (t) => {
        t.field(name, mutation);
      },
    });
    return mutationField;
  };
};

export default getMutationFieldFactory;
