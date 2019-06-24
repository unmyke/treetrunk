import getMutationFieldFactory from './get-mutation-field-factory';

const getFieldsToTypeMutationFactory = (typeName, mutations) => {
  const typeMutation = ({ utils: { getTypeMutation } }) => {
    const typeMutation = getTypeMutation(typeName);

    return typeMutation;
  };

  return Object.entries(mutations).reduce(
    (prevTypeMutations, [mutationFieldName, mutationField]) => ({
      ...prevTypeMutations,
      [`${typeName}.${mutationFieldName}`]: (ctx) => {
        const {
          utils: { getTypeMutation },
        } = ctx;

        const typeMutation = getTypeMutation(typeName);
        const getMutationField = getMutationFieldFactory(ctx);

        return getMutationField({
          typeMutation,
          mutationField,
        });
      },
    }),
    { [typeName]: typeMutation }
  );
};

export default getFieldsToTypeMutationFactory;
