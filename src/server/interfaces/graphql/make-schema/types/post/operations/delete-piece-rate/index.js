import { mutationField } from 'nexus';

import Post from '../../post';
import args from './args';
import resolve from './resolver';

const deletePieceRate = mutationField('deletePostPieceRateAt', {
  type: Post,
  description: "Delete post's pieceRate at day",
  args,
  resolve,
});
export default deletePieceRate;
