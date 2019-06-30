import {
  Post as getPostInput,
  PieceRate as getPieceRateInput,
} from '../inputs';

const createPostArgs = (ctx) => {
  const {
    utils: { getOperationArgs, getSchemaItem },
  } = ctx;
  const PostInput = getSchemaItem(getPostInput);
  const PieceRateInput = getSchemaItem(getPieceRateInput);

  return getOperationArgs('CreatePostInput', (t) => {
    t.field('post', { type: PostInput, required: true });
    t.field('pieceRate', { type: PieceRateInput, required: false });
  });
};
export default createPostArgs;
