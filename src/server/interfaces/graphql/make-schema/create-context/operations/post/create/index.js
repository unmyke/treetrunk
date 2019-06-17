import getArgs from './args';

const createPieceRate = (ctx) => {
  const {
    utils: { addTypeMutation },
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
