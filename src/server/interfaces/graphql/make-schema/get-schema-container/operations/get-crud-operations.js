const getCrudOperations = (ctx) => {
  const {
    cruds,
    utils: { getMutationField },
  } = ctx;

  return Object.entries(cruds).reduce(
    (prevCrudOperations, [typeName, cruds]) => {
      const crudField = getTypeCrud({ typeName, crudName: crud });
      const typeMutationField = getMutationField({
        typeName,
        field: crudField,
      });
      return {
        ...prevCrudOperations,
        typeMutationField,
      };
    },
    {}
  );
};
export default getCrudOperations;
