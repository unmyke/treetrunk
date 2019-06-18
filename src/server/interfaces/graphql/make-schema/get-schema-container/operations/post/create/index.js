import getArgs from './args';

const createPieceRate = (ctx) => {
  const {
    types: { Post },
    utils: { getTypeMutation },
    resolvers: { create: createResolver },
  } = ctx;
  const args = getArgs(ctx);

  return getTypeMutation('createPost', {
    type: Post,
    description: 'Add post',
    args,
    resolve: createResolver,
  });
};
export default createPieceRate;
