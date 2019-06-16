import getArgs from './args';
import resolve from './resolver';

const createPieceRate = (ctx) => {
  const { addTypeMutation } = ctx;
  const args = getArgs(ctx);

  return addTypeMutation('createPostPieceRate', {
    description: 'Add pieceRate to post',
    args,
    resolve,
  });
};
export default createPieceRate;
