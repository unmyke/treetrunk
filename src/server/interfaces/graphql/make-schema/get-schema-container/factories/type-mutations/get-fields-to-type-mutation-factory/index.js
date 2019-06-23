import getTypeMutationFactory from './get-type-mutation-factory';
import getMutationFieldFactory from './get-mutation-field-factory';

const getFieldsToTypeMutationFactory = (typeName, mutations) => {
  const getTypeMutation = getTypeMutationFactory(ctx);
  const typeMutation = getTypeMutation(typeName);

  return Object.entries(mutations).reduce(
    (prevTypeMutations, [mutationName, mutation]) => ({
      ...prevTypeMutations,
      [`${typeName}.${mutationName}`]: (ctx) => {
        const getMutationField = getMutationFieldFactory(ctx);
        return getMutationField({
          root: typeMutation,
          mutation,
        });
      },
    }),
    {}
  );
};

export default getFieldsToTypeMutationFactory;
