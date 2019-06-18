const createTypeOperations = (ctx) => ({ type, operations }) => {
  const { getTypeMutation } = ctx;
  const mutation = getTypeMutation(type);

  return Object.entries(operations).reduce(
    ([operationName, operation]) => ({
      ...prevOperations,
      [operationName]: operation(ctx),
    }),
    { mutation }
  );
};
