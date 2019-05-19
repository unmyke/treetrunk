import { mutationField } from 'nexus';

import Post from '../../post';
import args from './args';
import resolve from './resolver';

const updatePieceRate = mutationField('updatePostPieceRateTo', {
  type: Post,
  description: "Update post's pieceRate at day to new value and day",
  args,
  resolve,
});
export default updatePieceRate;
