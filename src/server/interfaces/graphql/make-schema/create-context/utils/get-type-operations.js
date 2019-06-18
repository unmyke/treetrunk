import generateTypeOperation from './generate-type-operation';

const getTypeOperations = (ctx) => (operationsByTypes) => {
  const { types } = ctx;

  return Object.entries(operationsByTypes).reduce(
    (prevOperations, [typeName, typeOperations]) => {
      const type = types[typeName];
      const typeOperation = generateTypeOperation(type);

      return {
        ...prevOperations,
        [typeName]: typeOperation(typeOperations(ctx)),
      };
    },
    {}
  );
};
export default getTypeOperations;
