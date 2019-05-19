import { mutationField } from 'nexus';

import Post from '../../post';
import args from './args';
import resolve from './resolver';

const createPieceRate = mutationField('createPostPieceRate', {
  type: Post,
  description: 'Add pieceRate to post',
  args,
  resolve,
});
export default createPieceRate;
