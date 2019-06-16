import { Day as DayScalar } from '../../../scalars';

const deletePieceRateArgs = (ctx) => {
  const {
    utils: { getOperationArgs },
  } = ctx;

  return getOperationArgs('DeletePostPieceRateInput', (t) => {
    t.id('id', { required: true });
    t.field('day', { type: DayScalar, required: true });
  });
};
export default deletePieceRateArgs;
