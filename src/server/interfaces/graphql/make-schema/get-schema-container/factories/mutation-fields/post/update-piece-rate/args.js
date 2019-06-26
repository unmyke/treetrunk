import { PieceRate as getPieceRateInput } from '../inputs';

const updatePieceRateArgs = (ctx) => {
  const {
    scalars: { Day },
    utils: { getOperationArgs, getSchemaItem },
  } = ctx;
  const PieceRateInput = getSchemaItem(getPieceRateInput);

  return getOperationArgs('UpdatePostPieceRateInput', (t) => {
    t.id('id', { required: true });
    t.field('day', { type: Day, required: true });
    t.field('newPieceRate', { type: PieceRateInput, required: true });
  });
};
export default updatePieceRateArgs;
