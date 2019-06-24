import { extendType } from 'nexus';

const getMutationFieldFactory = (ctx) => ({
  typeMutation,
  mutationField: getMutationField,
}) => {
  const { name, ...config } = getMutationField(ctx);

  return extendType({
    type: typeMutation.name,
    definition: (t) => {
      t.field(name, config);
    },
  });
};
export default getMutationFieldFactory;
