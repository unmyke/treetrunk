import getArgs from './args';
import resolve from './resolver';

const createPieceRate = (ctx) => {
  const {
    types: { Post },
    utils: { getTypeMutation },
  } = ctx;
  const args = getArgs(ctx);

  return getTypeMutation('createPostPieceRate', {
    type: Post,
    description: 'Add pieceRate to post',
    args,
    resolve,
  });
};
export default createPieceRate;
