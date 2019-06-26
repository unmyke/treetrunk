const updateDismissArgs = (ctx) => {
  const {
    scalars: { Day: DayScalar },
    utils: { getOperationArgs },
  } = ctx;

  return getOperationArgs('UpdateSellerDismissInput', (t) => {
    t.id('id', { required: true });
    t.field('day', { type: DayScalar, required: true });
  });
};
export default updateDismissArgs;
