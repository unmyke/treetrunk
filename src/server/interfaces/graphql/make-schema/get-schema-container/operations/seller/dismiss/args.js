import { Day as DayScalar } from '../../../scalars';

const dismissArgs = (ctx) => {
  const {
    utils: { getOperationArgs },
  } = ctx;
  return getOperationArgs('SellerDismissInput', (t) => {
    t.id('id', { required: true });
    t.field('day', { type: DayScalar, required: false });
  });
};
export default dismissArgs;
