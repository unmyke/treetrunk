import { PieceRate as getPieceRateInput } from '../inputs';

const createPieceRateArgs = (ctx) => {
  const {
    utils: { getOperationArgs },
  } = ctx;
  const PieceRateInput = getPieceRateInput(ctx);

  return getOperationArgs('CreatePostPieceRateInput', (t) => {
    t.id('id', { required: true });
    t.field('pieceRate', { type: PieceRateInput, required: true });
  });
};
export default createPieceRateArgs;
