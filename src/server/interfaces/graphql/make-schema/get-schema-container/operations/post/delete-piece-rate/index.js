import { mutationField } from 'nexus';

import getArgs from './args';
import resolve from './resolver';

const deletePieceRate = (ctx) => {
  const {
    types: { Post },
  } = ctx;
  const args = getArgs(ctx);

  return mutationField('deletePostPieceRateAt', {
    type: Post,
    description: "Delete post's pieceRate at day",
    args,
    resolve,
  });
};
export default deletePieceRate;
