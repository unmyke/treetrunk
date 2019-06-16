import getArgs from './args';

const createPieceRate = (ctx) => {
  const {
    addTypeMutation,
    type,
    operationResolvers,
    operationNames: { CREATE },
  } = ctx;
  const args = getArgs(ctx);
  const resolve = operationResolvers(CREATE);

  return addTypeMutation('createPost', {
    type,
    description: 'Add post',
    args,
    resolve,
  });
};
export default createPieceRate;
