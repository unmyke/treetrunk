import getArgs from './args';
import resolve from './resolver';

const createPieceRate = (ctx) => {
  const {
    types: { Post },
    utils: { getMutation },
  } = ctx;
  const args = getArgs(ctx);

  return getMutation('createPostPieceRate', {
    type: Post,
    description: 'Add pieceRate to post',
    args,
    resolve,
  });
};
export default createPieceRate;
