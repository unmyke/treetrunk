import { arg } from 'nexus';
import { Post as PostInput, PieceRate as PieceRateInput } from './inputs';

const createArgs = {
  post: arg({ type: PostInput, required: true }),
  pieceRate: arg({ type: PieceRateInput, required: true }),
};
export default createArgs;
