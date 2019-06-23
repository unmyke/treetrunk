const getOperations = (ctx) => (operations) =>
  Object.entries(operations).reduce(
    (prevOperations, [operationName, operation]) => ({
      ...prevOperations,
      [operationName]: operation(ctx),
    })
  );
export default getOperations;
