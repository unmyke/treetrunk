import updatePieceRate from './update-piece-rate';
import deletePieceRate from './delete-piece-rate';
import createPieceRate from './create-piece-rate';

const PostOperations = {
  updatePieceRate,
  deletePieceRate,
  createPieceRate,
};

const getPostOperations = (ctx) => {
  const {
    types: { Post },
    connections: { Post: PostConnection },
    utils: {
      getTypeMutationAdder,
      getTypeQueryAdder,
      getTypeOperationResolvers,
    },
  } = ctx;

  const addTypeMutation = getTypeMutationAdder(Post);
  const addTypeQuery = getTypeQueryAdder(Post);
  const operationResolvers = getTypeOperationResolvers(Post);

  return Object.entries(PostOperations).reduce(
    (prevOperations, [operationName, operation]) => ({
      ...prevOperations,
      [operationName]: operation({
        ...ctx,
        type: Post,
        typeConnection: PostConnection,
        addTypeMutation,
        addTypeQuery,
        operationResolvers,
      }),
    }),
    {}
  );
};
export default getPostOperations;
