import { PieceRate as getPieceRateInput } from '../inputs';

const createPieceRateArgs = (ctx) => {
  const {
    utils: { getOperationArgs },
    interfaces: { TypeOperationInputInterface },
  } = ctx;
  const PieceRateInput = getPieceRateInput(ctx);

  return getOperationArgs('CreatePostPieceRateInput', (t) => {
    t.implements(TypeOperationInputInterface);
    // t.id('id', { required: true });
    t.field('pieceRate', { type: PieceRateInput, required: true });
  });
};
export default createPieceRateArgs;
