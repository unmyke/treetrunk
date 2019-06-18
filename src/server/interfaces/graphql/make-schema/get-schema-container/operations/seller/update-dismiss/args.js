import { Day as DayScalar } from '../../../scalars';

const updateDismissArgs = (ctx) => {
  const {
    utils: { getOperationArgs },
  } = ctx;

  return getOperationArgs('UpdateSellerDismissInput', (t) => {
    t.id('id', { required: true });
    t.field('day', { type: DayScalar, required: true });
  });
};
export default updateDismissArgs;
