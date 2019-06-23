const createOperationsGetter = (ctx) => {
  const {} = ctx;
  return ({ Query, Mutation }) => {
    const getQuery = createQueryGetter(Query);
    const getMutation = createQueryGetter(Query);
    return (opertaions) => {
      Object.entries(operation).reduce(
        (prevOperations, [operartionName, operation]) => ({
          ...prevOperations,
          [operationName]: operation(ctx),
        })
      );
    };
  };
};
export default createOperationsGetter;
