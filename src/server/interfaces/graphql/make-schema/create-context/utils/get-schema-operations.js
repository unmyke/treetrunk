const getSchemaOperations = (ctx) => ({ operations, typesOperations }) => {
  const { getOperations, getTypeOperations } = ctx;

  return {
    ...getOperations(operations),
    ...getTypeOperations(typesOperations),
  };
};

export default getSchemaOperations;
