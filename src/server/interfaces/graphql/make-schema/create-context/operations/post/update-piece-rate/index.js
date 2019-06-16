import { mutationField } from 'nexus';

import { Post as getPost } from '../../../types';
import getArgs from './args';
import resolve from './resolver';

const updatePieceRate = (ctx) => {
  const Post = getPost(ctx);
  const args = getArgs(ctx);

  return mutationField('updatePostPieceRateTo', {
    type: Post,
    description: "Update post's pieceRate at day to new value and day",
    args,
    resolve,
  });
};
export default updatePieceRate;
