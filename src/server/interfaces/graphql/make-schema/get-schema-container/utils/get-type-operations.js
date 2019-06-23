import generateTypeOperation from './generate-type-operation';
import getTypeMutation from './get-type-mutation';

const getTypeOperations = (ctx) => (operationsByTypes) => {
  const {
    types,
    utils: { getTypeMutation, getTypeQuery },
  } = ctx;

  return Object.entries(operationsByTypes).reduce(
    (prevOperations, [typeName, typeOperations]) => {
      const type = types[typeName];
      const typeOperation = generateTypeOperation(type);
      const rootTypeMutation = getTypeMutation(type);
      const typeMutations = getTypeMutations(typeOperations);

      return {
        ...prevOperations,
        [typeName]: typeOperation(typeOperations(ctx)),
      };
    },
    {}
  );
};
export default getTypeOperations;
