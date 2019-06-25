// import getMutationFieldFactory from './get-mutation-field-factory';

const getTypeMutationFieldFactories = (typeName, mutationFieldFactories) => {
  const typeMutationFactory = ({ utils: { getTypeMutationField } }) =>
    getTypeMutationField(typeName);

  return Object.entries(mutationFieldFactories).reduce(
    (prevTypeFiledFactories, [mutationFieldName, mutationFieldFactory]) => ({
      ...prevTypeFiledFactories,
      [`${typeName}:${mutationFieldName}`]: getMutationFieldFactory({
        typeName,
        field: mutationFieldFactory,
      }),
    }),
    { [typeName]: typeMutationFactory }
    // {}
  );
};

export default getTypeMutationFieldFactories;
