import getArgs from './args';
import resolve from './resolver';

const updatePieceRate = (ctx) => {
  const {
    types: { Post },
  } = ctx;
  const args = getArgs(ctx);

  return {
    name: 'updatePostPieceRateTo',
    type: Post,
    description: "Update post's pieceRate at day to new value and day",
    args,
    resolve,
  };
};
export default updatePieceRate;
