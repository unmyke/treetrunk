import { extendType } from 'nexus';

const getMutationFieldFactory = ({ typeName, field: getMutationField }) => (
  ctx
) => {
  const {
    utils: { getTypeMutation },
  } = ctx;
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

export default getMutationFieldFactory;
