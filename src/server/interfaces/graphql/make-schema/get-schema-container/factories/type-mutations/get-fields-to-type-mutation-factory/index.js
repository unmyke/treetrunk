import getMutationFieldFactory from './get-mutation-field-factory';

const getFieldsToTypeMutationFactory = (typeName, mutations) =>
  Object.entries(mutations).reduce(
    (prevTypeMutations, [mutationName, mutation]) => ({
      ...prevTypeMutations,
      [`${typeName}.${mutationName}`]: (ctx) => {
        const {
          types,
          utils: { getTypeMutation },
        } = ctx;

        const type = types[typeName];
        const typeMutation = getTypeMutation(type);
        const getMutationField = getMutationFieldFactory(ctx);

        return getMutationField({
          root: typeMutation,
          mutation,
        });
      },
    }),
    {}
  );

export default getFieldsToTypeMutationFactory;
