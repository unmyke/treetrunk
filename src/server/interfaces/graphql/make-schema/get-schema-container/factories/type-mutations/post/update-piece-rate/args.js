import { PieceRate as getPieceRateInput } from '../inputs';

const updatePieceRateArgs = (ctx) => {
  const {
    interfaces: { TypeOperationInputInterface },
    scalars: { DayScalar },
    utils: { getOperationArgs },
  } = ctx;
  const PieceRateInput = getPieceRateInput(ctx);

  return getOperationArgs('UpdatePostPieceRateInput', (t) => {
    t.implements(TypeOperationInputInterface);
    // t.id('id', { required: true });
    t.field('day', { type: DayScalar, required: true });
    t.field('newPieceRate', { type: PieceRateInput, required: true });
  });
};
export default updatePieceRateArgs;
