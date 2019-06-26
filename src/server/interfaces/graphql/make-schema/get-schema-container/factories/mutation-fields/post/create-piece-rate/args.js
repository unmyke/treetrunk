import { PieceRate as getPieceRateInput } from '../inputs';

const createPieceRateArgs = (ctx) => {
  const {
    utils: { getOperationArgs, getSchemaItem },
  } = ctx;
  const PieceRateInput = getSchemaItem(getPieceRateInput);

  return getOperationArgs('CreatePostPieceRateInput', (t) => {
    t.id('id', { required: true });
    t.field('pieceRate', { type: PieceRateInput, required: true });
  });
};
export default createPieceRateArgs;
