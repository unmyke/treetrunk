import getMutationFieldFactory from './get-mutation-field-factory';

const getFieldsToTypeMutationFactory = (typeName, mutations) => {
  const typeMutation = ({ utils: { getTypeMutation } }) =>
    getTypeMutation(typeName);

  return Object.entries(mutations).reduce(
    (prevTypeMutations, [mutationFieldName, mutationField]) => ({
      ...prevTypeMutations,
      [`${typeName}:${mutationFieldName}`]: getMutationFieldFactory({
        typeName,
        field: mutationField,
      }),
    }),
    // { [typeName]: typeMutation }
    {}
  );
};

export default getFieldsToTypeMutationFactory;
