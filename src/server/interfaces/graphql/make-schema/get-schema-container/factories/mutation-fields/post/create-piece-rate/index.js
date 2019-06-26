import getArgs from './args';
import resolve from './resolver';

const createPieceRate = (ctx) => {
  const {
    types: { Post },
    utils: { getMutationField },
  } = ctx;
  const args = getArgs(ctx);

  return getMutationField(
    {
      name: 'createPieceRate',
      type: Post,
      description: 'Add pieceRate to post',
      args,
      resolve,
    },
    Post
  );
};
export default createPieceRate;
