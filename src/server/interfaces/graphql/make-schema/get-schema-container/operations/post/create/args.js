import {
  Post as getPostInput,
  PieceRate as getPieceRateInput,
} from '../inputs';

const createArgs = (ctx) => {
  const {
    utils: { getOperationArgs },
  } = ctx;
  const PostInput = getPostInput(ctx);
  const PieceRateInput = getPieceRateInput(ctx);

  return getOperationArgs({
    name: 'CreatePostInput',
    definition: (t) => {
      t.field('post', { type: PostInput, required: true });
      t.field('pieceRate', { type: PieceRateInput, required: false });
    },
  });
};
export default createArgs;
