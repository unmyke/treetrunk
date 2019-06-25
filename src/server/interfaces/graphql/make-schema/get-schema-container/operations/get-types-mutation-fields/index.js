import getTypeMutationFieldFactories from './get-type-mutation-field-factories';

const getTypesMutationFields = (ctx) => {
  const { typesMutationFields } = ctx;
  return Object.entries(typesMutationFields).reduce(
    (prevFieldFactories, [typeName, typeMutationFieldFactories]) => {
      const mutationFieldFactories = getTypeMutationFieldFactories(
        typeName,
        typeMutationFieldFactories
      );

      return {
        ...prevFieldFactories,
        ...mutationFieldFactories,
      };
    },
    {}
  );
};
export default getTypesMutationFields;
